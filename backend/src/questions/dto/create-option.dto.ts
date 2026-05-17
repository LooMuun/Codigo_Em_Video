import { IsString, IsBoolean } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  option!: string;

  @IsBoolean()
  isCorrect!: boolean;
}