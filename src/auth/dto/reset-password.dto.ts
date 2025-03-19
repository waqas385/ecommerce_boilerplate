import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/users/constants/regex.constants';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  public password: string;
  
  @IsString()
  @IsNotEmpty()
  public confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  public token: string;
}
