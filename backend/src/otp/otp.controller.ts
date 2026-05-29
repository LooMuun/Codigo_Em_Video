import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('auth')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('enviar-otp')
  async enviarOtp(@Body('email') email: string) {
    if (!email) throw new BadRequestException('E-mail obrigatorio');
    const challenge = await this.otpService.enviarOtp(email);
    return { message: 'Codigo enviado com sucesso', ...challenge };
  }

  @Post('validar-otp')
  async validarOtp(@Body() body: { challengeId: string; code: string }) {
    const valido = this.otpService.validarOtp(body.challengeId, body.code);
    if (!valido) throw new UnauthorizedException('Codigo invalido ou expirado');
    return { message: 'Autenticado com sucesso' };
  }
}
