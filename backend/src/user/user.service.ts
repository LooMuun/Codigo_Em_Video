import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { UpdateUserDto } from './dto/updateUserDto.dto';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    private checkPermission(targetUserId: string, currentUser: JwtPayload) {
        const isAdmin = currentUser.role === 'ADMIN';
        const isOwner = currentUser.sub === targetUserId;

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('Ação não permitida.');
        }
    }

    async update(id: string, data: UpdateUserDto, currentUser: JwtPayload) {
        this.checkPermission(id, currentUser);

        if(currentUser.role !== 'ADMIN') {
            const { role, ...safeData } = data;
            const { password, ...resunt } = await this.prisma.user.update({
                where: { id },
                data: safeData,
            });
        }

        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, currentUser: JwtPayload) {
        this.checkPermission(id, currentUser);
      
        return this.prisma.user.delete({
            where: { id },
        });
    }
}