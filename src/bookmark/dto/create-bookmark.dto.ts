import {
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDTO {
  @ApiProperty({
    description: 'Product ID',
    minLength: 5,
    maxLength: 20,
    example: 'MLA5721',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  readonly productId: string;

  @ApiProperty({
    description: 'Comment on the product',
    example: 'Excelent',
  })
  @IsString()
  readonly comment: string;

  @ApiProperty({
    description: 'Score of the product',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  readonly score: number;
}
