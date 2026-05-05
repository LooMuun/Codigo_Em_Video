import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateClassroomDto } from 'src/classRoms/dto/createClassroomDto.dto';

export class CreateModuleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  img: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassroomDto)
  classrooms?: CreateClassroomDto[];
}