import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/authModule.module';
import { ModulesModule } from './modules/modules.module';
import { ClassroomModule } from './classRoms/classRoom.module';
import { QuestionModule } from './questions/question.module';
import { ProgressModule } from './progress/progress.module';
import { RatingModule } from './rating/rating.module';
import { AiModule } from './ai/ai.module';
import { QuizAnswerModule } from './quiz-answer/quiz-answer.module';
import { OtpModule } from './otp/otp.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          configService.get<string>('SUPABASE_JWT_SECRET') ||
          'dev-secret',
        signOptions: { expiresIn: '7d' },
      }),
      global: true,
    }),
    AuthModule,
    UsersModule,
    ModulesModule,
    ClassroomModule,
    QuestionModule,
    ProgressModule,
    RatingModule,
    AiModule,
    QuizAnswerModule,
    OtpModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
