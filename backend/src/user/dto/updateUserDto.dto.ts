import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../generated/prisma';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  userName?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsEnum(Role)
  role?: Role 
}