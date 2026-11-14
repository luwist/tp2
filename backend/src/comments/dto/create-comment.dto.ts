import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content must not be empty' })
  @MaxLength(500, { message: 'Content must not exceed 500 characters' })
  content: string;
}
