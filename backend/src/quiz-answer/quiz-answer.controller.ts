import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { QuizAnswerService } from './quiz-answer.service';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('quiz-answers')
@UseGuards(JwtAuthGuard)
export class QuizAnswerController {
  constructor(private quizAnswerService: QuizAnswerService) {}

  @Post()
  answer(@Body() dto: CreateQuizAnswerDto, @Req() req) {
    return this.quizAnswerService.answer(dto, req.user);
  }

  @Get()
  getMyAnswers(@Req() req) {
    return this.quizAnswerService.getMyAnswers(req.user);
  }

  @Get('weaknesses')
  getMyWeaknesses(@Req() req) {
    return this.quizAnswerService.getMyWeaknesses(req.user);
  }
}
