import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto/chat.dto';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import Groq from 'groq-sdk';

const BASE_SYSTEM_PROMPT = `Você é um tutor educacional inteligente Chamado "Cody" da plataforma "Código em Vídeo", especializada no curso de Ciência de Dados.

Responsabilidades:
- Ajudar os alunos a entenderem os conteúdos do curso de forma clara, didática e amigável.
- Responder sempre em português brasileiro.
- Ser objetivo: respostas curtas, bem estruturadas e fáceis de ler, sem perder a completude.
- Usar exemplos práticos sempre que possível.

Restrições:
- Responda apenas perguntas relacionadas a Ciência de Dados, programação, estatística e machine learning.
- Se o aluno fugir do assunto, redirecione-o educadamente para os conteúdos do curso.
- Nunca invente informações. Se não souber algo, diga que não sabe.
- Nunca Enviar respostas Longas, seja o mais breve possivel.`;

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
 
  private async buildStudentContext(userId: string): Promise<string> {
    
    const [progress, wrongAnswers] = await Promise.all([
      this.prisma.progress.findMany({
        where: { userId, completed: true },
        include: { classroom: true },
      }),
      this.prisma.quizAnswer.findMany({
        where: { userId, isCorrect: false },
        include: {
          question: {
            include: { classroom: { include: { module: true } } },
          },
        },
      }),
    ]);

    let context = '';

    if (progress.length > 0) {
      const titles = progress.map((p) => p.classroom.title).join(', ');
      context += `\n\nAulas concluídas pelo aluno: ${titles}.`;
    }

    if (wrongAnswers.length > 0) {
      const weakTopics = [
        ...new Set(
          wrongAnswers.map(
            (a) => `${a.question.classroom.module.title} - ${a.question.classroom.title}`,
          ),
        ),
      ].join(', ');
      context += `\n\nTópicos com dificuldade (errou questões): ${weakTopics}. Reforce esses temas quando relevante.`;
    }

    return context;
  }

  private async buildContentContext(dto: ChatDto): Promise<string> {
    if (!dto.context) return '';

    if (dto.context.type === 'module') {
      const module = await this.prisma.module.findUnique({
        where: { id: dto.context.id },
        include: { classrooms: true },
      });
      if (!module) throw new NotFoundException('Módulo não encontrado');

      const aulas = module.classrooms.map((c) => c.title).join(', ');
      return `\n\nO aluno está no módulo "${module.title}": ${module.description}. Aulas: ${aulas}. Priorize o conteúdo deste módulo.`;
    }

    if (dto.context.type === 'classroom') {
      const classroom = await this.prisma.classroom.findUnique({
        where: { id: dto.context.id },
        include: { module: true },
      });
      if (!classroom) throw new NotFoundException('Aula não encontrada');

      return `\n\nO aluno está na aula "${classroom.title}" do módulo "${classroom.module.title}": ${classroom.description}. Priorize o conteúdo desta aula.`;
    }

    return '';
  }

  async chat(dto: ChatDto, currentUser: JwtPayload) {
    const [studentContext, contentContext] = await Promise.all([
      this.buildStudentContext(currentUser.sub),
      this.buildContentContext(dto),
    ]);

    const systemPrompt = BASE_SYSTEM_PROMPT + studentContext + contentContext;

    const history = (dto.history ?? []).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: dto.message },
      ],
    });

    return { response: completion.choices[0].message.content };
  }
}