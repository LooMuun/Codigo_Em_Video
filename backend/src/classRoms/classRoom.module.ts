import { Module } from '@nestjs/common';
import { ClassroomController } from './classRoom.controller';
import { ClassRomsService } from './classRoom.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassroomController],
  providers: [ClassRomsService],
})
export class ClassroomModule {}