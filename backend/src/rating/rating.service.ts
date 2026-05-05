import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  getRatings(moduleId: string) {
    return this.prisma.rating.findMany({
      where: { moduleId },
      include: { user: { select: { id: true, name: true, img: true } } },
    });
  }

  async createRating(data: CreateRatingDto, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found');

    const moduleExists = await this.prisma.module.findUnique({
      where: { id: data.moduleId },
    });

    if (!moduleExists) throw new Error('Módulo não encontrado');

    return this.prisma.rating.upsert({
      where: {
        userId_moduleId: {
          userId: currentUser.sub,
          moduleId: data.moduleId,
        },
      },
      update: {
        score: data.score,
        comment: data.comment,
      },
      create: {
        userId: currentUser.sub,
        moduleId: data.moduleId,
        score: data.score,
        comment: data.comment,
      },
    });
  }

  async deleteRating(moduleId: string, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found');
    if (currentUser.role !== 'ADMIN') throw new Error('Unauthorized');

    return this.prisma.rating.delete({
      where: {
        userId_moduleId: {
          userId: currentUser.sub,
          moduleId,
        },
      },
    });
  }
}
