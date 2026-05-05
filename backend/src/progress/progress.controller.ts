import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProgressDto } from './dto/create-progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProgress(@Req() req) {
    return this.progressService.getProgress(req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  completeClassroom(@Body() data: CreateProgressDto, @Req() req) {
    return this.progressService.completeClassroom(data, req.user);
  }

  @Delete(':classroomId')
  @UseGuards(JwtAuthGuard)
  removeProgress(@Param('classroomId') classroomId: string, @Req() req) {
    return this.progressService.removeProgress(classroomId, req.user);
  }
}