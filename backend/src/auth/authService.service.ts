import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
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
      throw new Error('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

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
