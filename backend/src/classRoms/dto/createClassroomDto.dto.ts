// dto/create-classroom.dto.ts
import { IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsString()
  description: string;

  @IsString()
  img: string;

  @IsString()
  moduleId: string;
}