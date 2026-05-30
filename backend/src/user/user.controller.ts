import { Body, Controller, Get, Param, Put, Delete, UseGuards, Req } from "@nestjs/common";
import { UsersService } from "./user.service";
import { JwtPayload } from "src/auth/interface/jwt-payload.interface";
import { UpdateUserDto } from "./dto/updateUserDto.dto";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";



@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req: Request & { user: JwtPayload }) {
        return this.usersService.getMe(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateUserDto,
        @Req() req: Request & { user: JwtPayload }
    ) {
        const user = req.user;

        return this.usersService.update(id, data, user);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Req() req: Request & { user: JwtPayload }
    ) {
        const user = req.user;

        return this.usersService.remove(id, user);
    }
}
