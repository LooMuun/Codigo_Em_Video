import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto/chat.dto';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';

import Groq from 'groq-sdk';

const pdfParse = require('pdf-parse');

const BASE_SYSTEM_PROMPT = `
Você é um tutor educacional inteligente chamado Cody.

REGRAS:
- Responda sempre em português brasileiro.
- Seja breve e direto.
- Explique códigos passo a passo.
- Nunca invente informações.
- Quando enviar código, envie completo.
- Se não souber a resposta, admita que não sabe.
`;

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  // =========================================
  // CHAT NORMAL
  // =========================================
  async chat(dto: ChatDto, user: JwtPayload) {
    try {
      if (!dto.message?.trim()) {
        throw new BadRequestException('Mensagem obrigatória');
      }

      const messages: any[] = [
        {
          role: 'system',
          content: BASE_SYSTEM_PROMPT,
        },
      ];

      if (dto.history?.length) {
        for (const msg of dto.history) {
          if (!msg?.content) continue;

          messages.push({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: String(msg.content),
          });
        }
      }

      messages.push({
        role: 'user',
        content: dto.message,
      });

      const completion = await this.groq.chat.completions.create({
        model: process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        messages,
      });

      const answer =
        completion.choices?.[0]?.message?.content ||
        'Não foi possível gerar resposta';

      return {
        success: true,
        response: answer,
      };
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        error?.message || 'Erro ao processar IA',
      );
    }
  }

  // =========================================
  // CHAT COM ARQUIVO (APENAS DOCUMENTOS)
  // =========================================
  async chatWithFile(dto: ChatDto, file: any, user: JwtPayload) {
    try {
      if (!file) {
        throw new BadRequestException('Arquivo obrigatório');
      }

      if (!dto.message?.trim()) {
        throw new BadRequestException('Mensagem obrigatória');
      }

      // Bloqueio explícito de imagens
      if (file.mimetype.startsWith('image/')) {
        throw new BadRequestException(
          'O sistema não suporta análise de imagens. Envie apenas arquivos de texto ou PDF.',
        );
      }

      let extractedText = '';
      const fileNameLower = file.originalname.toLowerCase();

      // =========================================
      // PDF
      // =========================================
      if (file.mimetype === 'application/pdf' || fileNameLower.endsWith('.pdf')) {
        try {
          const parsed = await pdfParse(file.buffer);
          extractedText = parsed.text || '';
        } catch (pdfError) {
          console.error('Erro PDF:', pdfError);
          throw new BadRequestException(
            'Esse PDF está corrompido ou não é suportado',
          );
        }
      }
      // =========================================
      // TEXTO E CÓDIGOS
      // =========================================
      else if (
        file.mimetype === 'text/plain' ||
        file.mimetype === 'application/json' ||
        file.mimetype === 'text/csv' ||
        fileNameLower.endsWith('.txt') ||
        fileNameLower.endsWith('.json') ||
        fileNameLower.endsWith('.csv') ||
        fileNameLower.endsWith('.ts') ||
        fileNameLower.endsWith('.js') ||
        fileNameLower.endsWith('.tsx') ||
        fileNameLower.endsWith('.jsx') ||
        fileNameLower.endsWith('.html') ||
        fileNameLower.endsWith('.css') ||
        fileNameLower.endsWith('.py') ||
        fileNameLower.endsWith('.java') ||
        fileNameLower.endsWith('.cpp')
      ) {
        extractedText = file.buffer.toString('utf-8');
      }
      // =========================================
      // NÃO SUPORTADO
      // =========================================
      else {
        throw new BadRequestException(
          `Tipo de arquivo não suportado: ${file.mimetype}`,
        );
      }

      if (!extractedText.trim()) {
        throw new BadRequestException('Não foi possível ler o conteúdo do arquivo');
      }

      const messages: any[] = [
        {
          role: 'system',
          content: BASE_SYSTEM_PROMPT,
        },
      ];

      if (dto.history?.length) {
        for (const msg of dto.history) {
          if (!msg?.content) continue;
          messages.push({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: String(msg.content),
          });
        }
      }

      messages.push({
        role: 'user',
        content: `
Pergunta do usuário:
${dto.message}

Nome do arquivo:
${file.originalname}

Conteúdo do arquivo:
${extractedText.substring(0, 15000)}
`,
      });

      const completion = await this.groq.chat.completions.create({
        model: process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        messages,
      });

      const answer =
        completion.choices?.[0]?.message?.content ||
        'Não foi possível gerar resposta';

      return {
        success: true,
        filename: file.originalname,
        type: 'document',
        response: answer,
      };
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        error?.message || 'Erro ao processar arquivo',
      );
    }
  }
}