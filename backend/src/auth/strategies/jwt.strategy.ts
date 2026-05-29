import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-symmetric') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        configService.get<string>('SUPABASE_JWT_SECRET') ||
        'dev-secret',
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role || 'user', // Supabase não envia role por padrão, definimos 'user' como fallback
    };
  }
}
