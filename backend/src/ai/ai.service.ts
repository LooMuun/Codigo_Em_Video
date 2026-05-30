import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto/chat.dto';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import Groq from 'groq-sdk';
const pdfParse = require('pdf-parse');

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  // =========================================
  // GERADOR DE PROMPT DINÂMICO
  // =========================================
  private buildSystemPrompt(studentData: any): string {
    const nome = studentData?.name || 'Aluno';
    
    // Pega o título da última aula registrada no progresso
    const ultimaAula = studentData?.progress?.[0]?.classroom?.title || 'Nenhuma aula registrada ainda';
    
    // Formata as últimas questões erradas lendo de QuizAnswer
    const questoesErradas = studentData?.quizAnswers?.length 
      ? studentData.quizAnswers.map((qa: any, index: number) => 
          `${index + 1}. A questão era "${qa.question.statement}" e ele marcou erroneamente a opção "${qa.option.option}"`
        ).join('\n')
      : 'Nenhuma questão errada recentemente.';

    return `
Você é um tutor educacional inteligente chamado Cody.

CONTEXTO DO ALUNO:
- Nome: ${nome}
- Onde parou de assistir (Última aula concluída): ${ultimaAula}

HISTÓRICO DE ERROS RECENTES DO ALUNO:
${questoesErradas}

REGRAS:
- Responda sempre em português brasileiro.
- Seja breve, direto e empático.
- Se o aluno perguntar onde parou, diga o nome da aula que está no contexto.
- Se ele perguntar o que errou, liste as questões erradas do contexto e explique de forma didática o conceito por trás delas para ajudá-lo a entender o erro.
- Explique códigos passo a passo.
- Nunca invente informações. Se não houver dados no contexto sobre aulas ou erros, diga que ainda não tem esse registro.
- Quando enviar código, envie completo.
- Se não souber a resposta, admita que não sabe.
    `.trim();
  }

  // =========================================
  // CHAT NORMAL
  // =========================================
  async chat(dto: ChatDto, user: JwtPayload) {
    try {
      if (!dto.message?.trim()) {
        throw new BadRequestException('Mensagem obrigatória');
      }

      // 1. Busca os dados reais do aluno e seu progresso/erros
      const studentData = await this.prisma.user.findUnique({
        where: { id: user.sub },
        select: {
          name: true,
          progress: {
            take: 1,
            orderBy: { completedAt: 'desc' },
            select: {
              classroom: {
                select: { title: true }
              }
            }
          },
          quizAnswers: {
            where: { isCorrect: false },
            take: 5,
            orderBy: { answeredAt: 'desc' },
            select: {
              question: {
                select: { statement: true }
              },
              option: {
                select: { option: true }
              }
            }
          }
        },
      });

      // 2. Cria as instruções da IA injetando o contexto do aluno
      const systemPrompt = this.buildSystemPrompt(studentData);

      const messages: any[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // 3. Adiciona o histórico da conversa atual
      if (dto.history?.length) {
        for (const msg of dto.history) {
          if (!msg?.content) continue;
          messages.push({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: String(msg.content),
          });
        }
      }

      // 4. Adiciona a nova mensagem do usuário
      messages.push({
        role: 'user',
        content: dto.message,
      });

      // 5. Envia para o Groq
      const completion = await this.groq.chat.completions.create({
        model: process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        messages,
      });

      const answer =
        completion.choices?.[0]?.message?.content ||
        'Não foi possível gerar resposta';

      return {
        success: true,
        response: answer,
      };
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        error?.message || 'Erro ao processar IA',
      );
    }
  }

  // =========================================
  // CHAT COM ARQUIVO (APENAS DOCUMENTOS)
  // =========================================
  async chatWithFile(dto: ChatDto, file: any, user: JwtPayload) {
    try {
      if (!file) throw new BadRequestException('Arquivo obrigatório');
      if (!dto.message?.trim()) throw new BadRequestException('Mensagem obrigatória');

      if (file.mimetype.startsWith('image/')) {
        throw new BadRequestException(
          'O sistema não suporta análise de imagens. Envie apenas arquivos de texto ou PDF.',
        );
      }

      let extractedText = '';
      const fileNameLower = file.originalname.toLowerCase();

      // Extração de texto do arquivo
      if (file.mimetype === 'application/pdf' || fileNameLower.endsWith('.pdf')) {
        try {
          const parsed = await pdfParse(file.buffer);
          extractedText = parsed.text || '';
        } catch (pdfError) {
          console.error('Erro PDF:', pdfError);
          throw new BadRequestException('Esse PDF está corrompido ou não é suportado');
        }
      } else if (
        file.mimetype === 'text/plain' ||
        file.mimetype === 'application/json' ||
        file.mimetype === 'text/csv' ||
        fileNameLower.match(/\.(txt|json|csv|ts|js|tsx|jsx|html|css|py|java|cpp)$/)
      ) {
        extractedText = file.buffer.toString('utf-8');
      } else {
        throw new BadRequestException(`Tipo de arquivo não suportado: ${file.mimetype}`);
      }

      if (!extractedText.trim()) {
        throw new BadRequestException('Não foi possível ler o conteúdo do arquivo');
      }

      // 1. Busca os mesmos dados do aluno
      const studentData = await this.prisma.user.findUnique({
        where: { id: user.sub },
        select: {
          name: true,
          progress: {
            take: 1,
            orderBy: { completedAt: 'desc' },
            select: {
              classroom: { select: { title: true } }
            }
          },
          quizAnswers: {
            where: { isCorrect: false },
            take: 5,
            orderBy: { answeredAt: 'desc' },
            select: {
              question: { select: { statement: true } },
              option: { select: { option: true } }
            }
          }
        },
      });

      // 2. Gera o prompt dinâmico
      const systemPrompt = this.buildSystemPrompt(studentData);

      const messages: any[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // 3. Histórico de mensagens
      if (dto.history?.length) {
        for (const msg of dto.history) {
          if (!msg?.content) continue;
          messages.push({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: String(msg.content),
          });
        }
      }

      // 4. Monta a mensagem final contendo o texto do arquivo
      messages.push({
        role: 'user',
        content: `
Pergunta do usuário:
${dto.message}

Nome do arquivo:
${file.originalname}

Conteúdo do arquivo (Limitado aos primeiros 15000 caracteres):
${extractedText.substring(0, 15000)}
`,
      });

      // 5. Envia para o Groq
      const completion = await this.groq.chat.completions.create({
        model: process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        messages,
      });

      const answer =
        completion.choices?.[0]?.message?.content ||
        'Não foi possível gerar resposta';

      return {
        success: true,
        filename: file.originalname,
        type: 'document',
        response: answer,
      };
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        error?.message || 'Erro ao processar arquivo',
      );
    }
  }
}