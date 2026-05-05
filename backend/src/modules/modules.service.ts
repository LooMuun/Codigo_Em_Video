import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuleDto } from './dto/createModule.dto';
import { UpdateModuleDto } from './dto/updateModule.dto';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  async validateAdmin(currentUser: JwtPayload) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
  }

  getModules() {
    return this.prisma.module.findMany();
  }

  async createModule(data: CreateModuleDto, currentUser: JwtPayload) {
    if (!currentUser) throw new Error('User not found');
    await this.validateAdmin(currentUser);

    const { classrooms, ...moduleData } = data;

    return this.prisma.module.create({
      data: {
        ...moduleData,
        classrooms: classrooms?.length ? { create: classrooms } : undefined,
      },
      include: { classrooms: true },
    });
  }

  async updateModule(
    id: string,
    data: UpdateModuleDto,
    currentUser: JwtPayload,
  ) {
    if (!currentUser) throw new Error('User not found');
    await this.validateAdmin(currentUser);

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
    if (!currentUser) throw new Error('User not found');
    await this.validateAdmin(currentUser);

    return this.prisma.module.delete({ where: { id } });
  }
}
