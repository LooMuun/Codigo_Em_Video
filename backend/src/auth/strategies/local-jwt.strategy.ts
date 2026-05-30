import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LocalJwtStrategy extends PassportStrategy(Strategy, 'jwt-local') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') ||
                   configService.get<string>('SUPABASE_JWT_SECRET') ||
                   'dev-secret';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
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
