import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get('classroom/:classroomId')
  getQuestions(@Param('classroomId') classroomId: string) {
    return this.questionService.getQuestions(classroomId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createQuestion(@Body() data: CreateQuestionDto, @Req() req) {
    return this.questionService.createQuestion(data, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateQuestion(@Param('id') id: string, @Body() data: UpdateQuestionDto, @Req() req) {
    return this.questionService.updateQuestion(id, data, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteQuestion(@Param('id') id: string, @Req() req) {
    return this.questionService.deleteQuestion(id, req.user);
  }
}