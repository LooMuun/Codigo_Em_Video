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
import { RatingService } from './rating.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Get('module/:moduleId')
  getRatings(@Param('moduleId') moduleId: string) {
    return this.ratingService.getRatings(moduleId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createRating(@Body() data: CreateRatingDto, @Req() req: AuthenticatedRequest) {
    return this.ratingService.createRating(data, req.user);
  }

  @Delete(':moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteRating(@Param('moduleId') moduleId: string, @Req() req: AuthenticatedRequest) {
    return this.ratingService.deleteRating(moduleId, req.user);
  }
}
