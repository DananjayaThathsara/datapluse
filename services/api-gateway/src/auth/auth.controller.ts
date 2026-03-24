import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

// Controller that handles authentication routes for user registration and login
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Route for user registration — accepts email and password, returns success or error message
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Route for user login — accepts email and password, returns JWT token if successful
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
