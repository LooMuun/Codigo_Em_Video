import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  private async validateAdmin(currentUser: JwtPayload) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
  }

  getQuestions(classroomId: string) {
    return this.prisma.question.findMany({
      where: { classroomId },
      include: { options: true },
    });
  }

  async createQuestion(data: CreateQuestionDto, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found');
    await this.validateAdmin(currentUser);

    const classroomExists = await this.prisma.classroom.findUnique({
      where: { id: data.classroomId },
    });
    if (!classroomExists) throw new Error('Aula não encontrada');

    const { options, ...questionData } = data;

    return this.prisma.question.create({
      data: {
        ...questionData,
        options: options?.length
          ? { create: options }
          : undefined,
      },
      include: { options: true },
    });
  }

  async updateQuestion(id: string, data: UpdateQuestionDto, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found');
    await this.validateAdmin(currentUser);

    const { options, ...questionData } = data;

    return this.prisma.question.update({
      where: { id },
      data: {
        ...questionData,
        options: options?.length
          ? { create: options }
          : undefined,
      },
      include: { options: true },
    });
  }

  async deleteQuestion(id: string, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found');
    await this.validateAdmin(currentUser);

    return this.prisma.question.delete({ where: { id } });
  }
}