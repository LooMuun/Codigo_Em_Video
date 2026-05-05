import { IsString } from 'class-validator';

export class CreateProgressDto {
  @IsString()
  classroomId: string;
}