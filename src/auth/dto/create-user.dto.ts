import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description:
      'The password of the user. Must contain at least one uppercase letter, one lowercase letter, and one number.',
    minLength: 6,
    maxLength: 50,
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  /*@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })*/
  readonly password: string;

  @ApiProperty({
    description: 'The full name of the user',
    minLength: 5,
    example: 'John Doe',
  })
  @IsString()
  @MinLength(5)
  readonly fullName: string;
}
