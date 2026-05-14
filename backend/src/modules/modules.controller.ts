import { Body, Controller, Param, Get, Post, Put, Req, UseGuards, Delete } from '@nestjs/common';
import { ModuleService } from './modules.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateModuleDto } from './dto/createModule.dto';
import { UpdateModuleDto } from './dto/updateModule.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

@Controller('modules')
export class ModulesController {
  constructor(private moduleService: ModuleService) {}

  @Get()
  getModules() {
    return this.moduleService.getModules();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createModule(@Body() data: CreateModuleDto, @Req() req: AuthenticatedRequest) {
    console.log('body recebido:', JSON.stringify(data));
    return this.moduleService.createModule(data, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async updateModule(@Param('id') id: string, @Body() data: UpdateModuleDto, @Req() req: AuthenticatedRequest) {
    return this.moduleService.updateModule(id, data, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteModule(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.moduleService.deleteModule(id, req.user);
  }
}