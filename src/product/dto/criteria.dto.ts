import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination.dto';

export class CriteriaDto {
  @ApiProperty({
    description: 'Keyword to search for in the product names or descriptions',
    example: 'laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'Minimum price of the products to search for',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Enable implicit conversions
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price of the products to search for',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Enable implicit conversions
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Brand of the products to search for',
    example: 'Apple',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    default: 10,
    description: 'How many elements do you need',
  })
  //@IsOptional()
  @IsPositive()
  @Type(() => Number) // enableImplicitConversions: true
  limit: number;

  @ApiProperty({
    default: 0,
    description: 'How many elements do you want to skip',
  })
  //@IsOptional()
  @Min(0)
  @Type(() => Number) // enableImplicitConversions: true
  offset: number;
}
