import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  moduleId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  comment?: string;
}