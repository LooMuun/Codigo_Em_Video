import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /** Lista arquivos de um módulo: GET /files/list?modulo=1 */
  @Get('list')
  @UseGuards(JwtAuthGuard)
  listFiles(@Query('modulo') moduloId?: string) {
    return this.filesService.listFiles(moduloId);
  }

  /** Download de um arquivo: GET /files/download?name=arquivo.pdf&categoria=slides */
  @Get('download')
  @UseGuards(JwtAuthGuard)
  async downloadFile(
    @Query('name') fileName: string,
    @Query('categoria') categoria: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.filesService.getFilePath(fileName, categoria);
      return res.download(filePath);
    } catch {
      throw new NotFoundException('Arquivo não encontrado no servidor.');
    }
  }
}
