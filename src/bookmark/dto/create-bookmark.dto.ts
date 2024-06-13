import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDTO {
  @ApiProperty({
    description: 'The full name of the user',
    minLength: 5,
    maxLength: 20,
    example: 'Computer',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  readonly productId: string;
}
