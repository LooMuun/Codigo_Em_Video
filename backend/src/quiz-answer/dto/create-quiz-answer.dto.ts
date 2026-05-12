import { IsString } from 'class-validator';

export class CreateQuizAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  optionId: string;
}
