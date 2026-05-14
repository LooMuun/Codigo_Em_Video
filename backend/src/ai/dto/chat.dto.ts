import { IsString, IsOptional, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatContextDto {
  @IsIn(['module', 'classroom'])
  type!: 'module' | 'classroom';

  @IsString()
  id!: string;
}

export class ChatMessageDto {
  @IsString()
  role!: 'user' | 'model';

  @IsString()
  content!: string;
}

export class ChatDto {
  @IsString()
  message!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChatContextDto)
  context?: ChatContextDto;

  @IsOptional()
  history?: ChatMessageDto[];
}
