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
import { ClassRomsService } from './classRoom.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateClassroomDto } from './dto/createClassroomDto.dto';
import { UpdateClassroomDto } from './dto/updateClassroomdto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('classrooms')
export class ClassroomController {
  constructor(private classRomsService: ClassRomsService) {}

  @Get()
  getClassrooms() {
    return this.classRomsService.getClassRooms();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createClassroom(@Body() data: CreateClassroomDto, @Req() req) {
    return this.classRomsService.createClassroom(data, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateClassroom(@Param('id') id: string, @Body() data: UpdateClassroomDto, @Req() req) {
    return this.classRomsService.updateClassroom(id, data, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteClassroom(@Param('id') id: string, @Req() req) {
    return this.classRomsService.deleteClassroom(id, req.user);
  }
}