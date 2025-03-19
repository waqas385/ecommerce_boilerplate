import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  public async signin(@Body() signInDto: SignInDto): Promise<any> {
    const requestDTO = plainToInstance(SignInDto, signInDto);
    return await this.authService.signin(requestDTO);
  }

  @Post('sign-up')
  public async signup(@Body() signUpDto: SignUpDto): Promise<any> {
    const requestDTO = plainToInstance(SignUpDto, signUpDto);
    return await this.authService.signup(requestDTO);
  }

  @Post('forgot-password')
  public async forgotPassword(@Body('email') email: string): Promise<any> {
    return await this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  public async verifyLink(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    const requestDTO = plainToInstance(ResetPasswordDto, resetPasswordDto);
    return await this.authService.resetPassword(requestDTO);
  }
}
