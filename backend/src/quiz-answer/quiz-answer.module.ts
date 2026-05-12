import { Module } from '@nestjs/common';
import { QuizAnswerController } from './quiz-answer.controller';
import { QuizAnswerService } from './quiz-answer.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuizAnswerController],
  providers: [QuizAnswerService],
})
export class QuizAnswerModule {}
