import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CommonService } from 'src/common/common.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private commonService: CommonService,
  ) {}

  public async signin(signInDto: SignInDto): Promise<any> {
    const user = await this.userService.signin(signInDto);
    return {
      tenantId: user.id,
      accessToken: await this.commonService.generateJWT({
        userId: user.id,
        fullName: user.fullName,
        role: user.role,
      }),
    };
  }

  public async signup(signUpDto: SignUpDto): Promise<any> {
    await this.userService.signup(signUpDto);
    return {
      message: 'User successfully signed-up',
    };
  }

  public async forgotPassword(email: string): Promise<any> {
    const token = await this.userService.forgotPassword(email);
    return {
      message: 'Use token to reset password',
      token
    }
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const decryptedText = await this.commonService.decrypt(resetPasswordDto.token);
    const [email, otp] = decryptedText.split('^');

    const isVerified = await this.userService.isVerifiedEmailOTP(email, otp);

    if (isVerified && resetPasswordDto.password != resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Password & Confirm password does not match');
    }
    
    await this.userService.resetPassword(resetPasswordDto.password, email);

    return {
      message: 'Password successfully updated'
    }
  }
}
