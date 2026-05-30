import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-symmetric') {
  constructor(configService: ConfigService) {
    const supabaseJwtSecret = configService.get<string>('SUPABASE_JWT_SECRET') ?? '';

    // O Supabase assina os tokens com o secret em base64 decoded (buffer raw)
    const secretOrKey = Buffer.from(supabaseJwtSecret, 'base64');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role ?? 'user',
    };
  }
}