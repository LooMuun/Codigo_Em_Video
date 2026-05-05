import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from './create-option.dto';

export class CreateQuestionDto {
  @IsString()
  statement: string;

  @IsString()
  classroomId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}