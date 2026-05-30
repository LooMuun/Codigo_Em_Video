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
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  // A rota GET unificada e protegida
// A rota GET unificada e protegida
  @UseGuards(JwtAuthGuard) 
  @Get('classroom/:id')
  findByClassroom(
    @Param('id') classroomId: string, 
    @Req() req: AuthenticatedRequest
  ) {
    // Aqui está a correção: usamos apenas o 'sub' (que já existe no seu JwtPayload)
    const userId = req.user.sub; 
    
    return this.questionService.findByClassroom(classroomId, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createQuestion(@Body() data: CreateQuestionDto, @Req() req: AuthenticatedRequest) {
    return this.questionService.createQuestion(data, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateQuestion(@Param('id') id: string, @Body() data: UpdateQuestionDto, @Req() req: AuthenticatedRequest) {
    return this.questionService.updateQuestion(id, data, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteQuestion(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.questionService.deleteQuestion(id, req.user);
  }
}