import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO, CreateUserDTO } from './dto/';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input, object invalid.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  createUser(@Body() createAuthDto: CreateUserDTO) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid credentials.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @ApiOperation({ summary: 'Testing private route' })
  @ApiResponse({
    status: 200,
    description: 'Access to private route successful.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, access denied.',
  })
  @Auth(ValidRoles.admin, ValidRoles.buyer)
  testingPrivateRoute() {
    return {
      ok: true,
      message: 'Hi world private',
    };
  }
}
