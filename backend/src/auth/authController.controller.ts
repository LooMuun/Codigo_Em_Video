import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./authService.service";
import { CreateUserDto } from "./dto/CreateUserDto.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
      return this.authService.register(createUserDto);
    }
}