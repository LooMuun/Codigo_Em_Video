// src/modules/modules.module.ts
import { Module } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModuleService } from './modules.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ModulesController],
  providers: [ModuleService],
})
export class ModulesModule {}