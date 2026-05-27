import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  chat(@Body() dto: ChatDto, @Req() req: AuthenticatedRequest) {
    return this.aiService.chat(dto, req.user);
  }
}
