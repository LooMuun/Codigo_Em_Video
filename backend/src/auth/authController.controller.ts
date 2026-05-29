import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./authService.service";
import { CreateUserDto } from "./dto/CreateUserDto.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthenticatedRequest } from "../common/interfaces/authenticated-request.interface";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
      return this.authService.register(createUserDto);
    }

    @Post("login")
    async login(@Body() body: { email: string; password: string }) {
      const { email, password } = body;
      return this.authService.login(email, password);
    }

    @UseGuards(JwtAuthGuard)
    @Get("recovery-2fa/status")
    async recovery2faStatus(@Req() req: AuthenticatedRequest) {
      return this.authService.getRecovery2faStatus(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post("recovery-2fa/setup")
    async setupRecovery2fa(@Req() req: AuthenticatedRequest) {
      return this.authService.setupRecovery2fa(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post("recovery-2fa/enable")
    async enableRecovery2fa(
      @Req() req: AuthenticatedRequest,
      @Body() body: { code: string },
    ) {
      return this.authService.enableRecovery2fa(req.user.sub, body.code);
    }

    @Post("recover-password")
    async recoverPassword(
      @Body() body: { email: string; code: string; newPassword: string },
    ) {
      return this.authService.recoverPasswordWith2fa(
        body.email,
        body.code,
        body.newPassword,
      );
    }
}
