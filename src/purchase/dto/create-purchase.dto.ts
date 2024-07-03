import {
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseDTO {
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
    description: 'Price of the product',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  readonly price: number;

  @ApiProperty({
    description: 'Count of the product',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  readonly count: number;
}
