import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './authService.service';
import { AuthController } from './authController.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalJwtStrategy } from './strategies/local-jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule,
    OtpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          configService.get<string>('SUPABASE_JWT_SECRET') ||
          'dev-secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy, JwtStrategy, LocalJwtStrategy],
})
export class AuthModule {}
