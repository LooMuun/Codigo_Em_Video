import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassroomDto } from './dto/createClassroomDto.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { UpdateClassroomDto } from './dto/updateClassroomdto.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassRomsService {
  constructor(private prisma: PrismaService) {}

  async validateAdmin(currentUser: JwtPayload) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
  }

  getClassRooms() {
    return this.prisma.classroom.findMany();
  }

  async createClassroom(data: CreateClassroomDto, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found'); 
    await this.validateAdmin(currentUser);

    const moduleExists = await this.prisma.module.findUnique({
      where: { id: data.moduleId },
    });

    if (!moduleExists) throw new Error('Módulo não encontrado');

    return this.prisma.classroom.create({ data });
  }

  async updateClassroom(id: string, data: UpdateClassroomDto, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found'); 
    await this.validateAdmin(currentUser);

    const moduleExists = await this.prisma.module.findUnique({
      where: { id: data.moduleId },
    });

    if (!moduleExists) throw new Error('Módulo não encontrado');

    return this.prisma.classroom.update({
      where: { id },
      data,
    });
  }

  async deleteClassroom(id: string, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found'); 
    await this.validateAdmin(currentUser);

    return this.prisma.classroom.delete({ where: { id } });
  }

}
