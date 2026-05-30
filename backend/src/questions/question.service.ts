import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  private validateAdmin(currentUser: JwtPayload) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas admins podem realizar esta ação');
    }
  }

  // A antiga getQuestions foi substituída por esta
  async findByClassroom(classroomId: string, userId: string) {
    return this.prisma.question.findMany({
      where: { 
        classroomId: classroomId 
      },
      include: {
        options: true, 
        quizAnswers: {
          where: {
            userId: userId
          }
        }
      }
    });
  }

  async createQuestion(data: CreateQuestionDto, currentUser: JwtPayload) {
    this.validateAdmin(currentUser);

    const classroomExists = await this.prisma.classroom.findUnique({
      where: { id: data.classroomId },
    });
    if (!classroomExists) throw new NotFoundException('Aula não encontrada');

    const { options, ...questionData } = data;

    return this.prisma.question.create({
      data: {
        ...questionData,
        options: options?.length ? { create: options } : undefined,
      },
      include: { options: true },
    });
  }

  async updateQuestion(id: string, data: UpdateQuestionDto, currentUser: JwtPayload) {
    this.validateAdmin(currentUser);

    const { options, ...questionData } = data;

    return this.prisma.question.update({
      where: { id },
      data: {
        ...questionData,
        options: options?.length ? { create: options } : undefined,
      },
      include: { options: true },
    });
  }

  async deleteQuestion(id: string, currentUser: JwtPayload) {
    this.validateAdmin(currentUser);
    return this.prisma.question.delete({ where: { id } });
  }
}