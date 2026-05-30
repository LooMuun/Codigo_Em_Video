import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  moduleId!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  score!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}