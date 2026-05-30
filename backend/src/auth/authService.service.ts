import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private configService: ConfigService,
  ) {}

  async register(data: CreateUserDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
 
    if (userExists) {
      throw new ConflictException('Usuário já existe');
    }
 
    const hashedPassword = await bcrypt.hash(data.password, 10);
 
    const { password, ...user } = await this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
 
    return user; 
  }


  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail ou senha invalidos');
    }

    return this.criarSessao(user);
  }

  async setupRecovery2fa(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario nao encontrado');
    }

    const secret = this.otpService.criarTotpSecret();

    await (this.prismaService.user.update as any)({
      where: { id: userId },
      data: { totpSecret: secret, totpEnabled: false },
    });

    return {
      secret,
      otpauthUrl: this.otpService.criarTotpUri(user.email, secret),
    };
  }

  async enableRecovery2fa(userId: string, code: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(user as any).totpSecret) {
      throw new BadRequestException('Configure o 2FA antes de ativar');
    }

    if (!this.otpService.validarTotp((user as any).totpSecret, code)) {
      throw new UnauthorizedException('Codigo invalido');
    }

    await (this.prismaService.user.update as any)({
      where: { id: userId },
      data: { totpEnabled: true },
    });

    return { enabled: true };
  }

  async getRecovery2faStatus(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, totpEnabled: true } as any,
    } as any);

    return { enabled: Boolean((user as any)?.totpEnabled) };
  }

  async recoverPasswordWith2fa(email: string, code: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('A nova senha precisa ter pelo menos 6 caracteres');
    }

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || !(user as any).totpEnabled || !(user as any).totpSecret) {
      throw new UnauthorizedException('Recuperacao por 2FA nao configurada');
    }

    if (!this.otpService.validarTotp((user as any).totpSecret, code)) {
      throw new UnauthorizedException('Codigo invalido ou expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: 'Senha atualizada com sucesso' };
  }

  private criarSessao(user: { id: string; email: string; name: string | null; role: any }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const secret = this.configService.get<string>('JWT_SECRET') ||
                   this.configService.get<string>('SUPABASE_JWT_SECRET') ||
                   'dev-secret';

    const token = this.jwtService.sign(payload, { secret });

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
