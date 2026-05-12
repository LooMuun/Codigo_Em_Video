import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@Injectable()
export class QuizAnswerService {
  constructor(private prisma: PrismaService) {}

  async answer(dto: CreateQuizAnswerDto, currentUser: JwtPayload) {
    const option = await this.prisma.option.findUnique({
      where: { id: dto.optionId },
      include: { question: true },
    });

    if (!option) throw new NotFoundException('Opção não encontrada');
    if (option.questionId !== dto.questionId) {
      throw new NotFoundException('Opção não pertence a essa questão');
    }

    return this.prisma.quizAnswer.upsert({
      where: {
        userId_questionId: {
          userId: currentUser.sub,
          questionId: dto.questionId,
        },
      },
      update: {
        optionId: dto.optionId,
        isCorrect: option.isCorrect,
        answeredAt: new Date(),
      },
      create: {
        userId: currentUser.sub,
        questionId: dto.questionId,
        optionId: dto.optionId,
        isCorrect: option.isCorrect,
      },
    });
  }

  async getMyAnswers(currentUser: JwtPayload) {
    return this.prisma.quizAnswer.findMany({
      where: { userId: currentUser.sub },
      include: {
        question: {
          include: {
            classroom: { include: { module: true } },
          },
        },
        option: true,
      },
    });
  }

  async getMyWeaknesses(currentUser: JwtPayload) {
    const wrongAnswers = await this.prisma.quizAnswer.findMany({
      where: { userId: currentUser.sub, isCorrect: false },
      include: {
        question: {
          include: {
            classroom: { include: { module: true } },
          },
        },
      },
    });

    const weaknessByModule: Record<string, { moduleName: string; errors: number }> = {};

    for (const answer of wrongAnswers) {
      const moduleId = answer.question.classroom.moduleId;
      const moduleName = answer.question.classroom.module.title;

      if (!weaknessByModule[moduleId]) {
        weaknessByModule[moduleId] = { moduleName, errors: 0 };
      }
      weaknessByModule[moduleId].errors++;
    }

    return Object.entries(weaknessByModule)
      .map(([moduleId, data]) => ({ moduleId, ...data }))
      .sort((a, b) => b.errors - a.errors);
  }
}
