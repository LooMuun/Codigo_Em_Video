import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUserDto.dto";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    async register(data: CreateUserDto) {
        const userExists = await this.prismaService.user.findUnique({
            where: { email: data.email },
        });
        if (userExists) {
            throw new Error("User already exists");
        }
        const user = await this.prismaService.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
            },
        });
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (!user || user.password !== password) {
            throw new Error("Invalid credentials");
        }
        return user;
    }
}