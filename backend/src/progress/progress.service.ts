import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  getProgress(currentUser: JwtPayload) {
    return this.prisma.progress.findMany({
      where: { userId: currentUser.sub },
      include: { classroom: true },
    });
  }

  async completeClassroom(data: CreateProgressDto, currentUser: JwtPayload) {
    const classroomExists = await this.prisma.classroom.findUnique({
      where: { id: data.classroomId },
    });
    if (!classroomExists) throw new NotFoundException('Aula não encontrada');

    return this.prisma.progress.upsert({
      where: {
        userId_classroomId: {
          userId: currentUser.sub,
          classroomId: data.classroomId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: currentUser.sub,
        classroomId: data.classroomId,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  async removeProgress(classroomId: string, currentUser: JwtPayload) {
    return this.prisma.progress.delete({
      where: {
        userId_classroomId: {
          userId: currentUser.sub,
          classroomId,
        },
      },
    });
  }
}