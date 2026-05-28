import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @Body() dto: ChatDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.aiService.chat(dto, req.user);
  }

  @Post('chat-file')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async chatFile(
    @UploadedFile() file: any,
    @Body() dto: ChatDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.aiService.chatWithFile(
      dto,
      file,
      req.user,
    );
  }
}