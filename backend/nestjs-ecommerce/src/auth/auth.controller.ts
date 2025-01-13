import { 
  Controller, 
  Post, 
  Body, 
  ValidationPipe, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto
  ) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto
  ) {
    return this.authService.login(loginDto);
  }

  @Post('/profile')
  @UseGuards(AuthGuard())
  async getProfile(@Req() req) {
    return req.user;
  }
}
