import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuleDto } from './dto/createModule.dto';
import { UpdateModuleDto } from './dto/updateModule.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  private validateAdmin(currentUser: JwtPayload) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas admins podem realizar esta ação');
    }
  }

  getModules() {
    return this.prisma.module.findMany();
  }

  async createModule(data: CreateModuleDto, currentUser: JwtPayload) {
    this.validateAdmin(currentUser);

    const { classrooms, ...moduleData } = data;

    return this.prisma.module.create({
      data: {
        ...moduleData,
        classrooms: classrooms?.length ? { create: classrooms } : undefined,
      },
      include: { classrooms: true },
    });
  }

  async updateModule(id: string, data: UpdateModuleDto, currentUser: JwtPayload) {
    this.validateAdmin(currentUser);

    const { classrooms, ...moduleData } = data;

    return this.prisma.module.update({
      where: { id },
      data: {
        ...moduleData,
        classrooms: classrooms?.length ? { create: classrooms } : undefined,
      },
      include: { classrooms: true },
    });
  }

  async deleteModule(id: string, currentUser: JwtPayload) {
    this.validateAdmin(currentUser);
    return this.prisma.module.delete({ where: { id } });
  }
}