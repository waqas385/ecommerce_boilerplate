import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from 'src/users/constants/regex.constants';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(EMAIL_REGEX, {
    message: 'Valid email is required',
  })
  @Transform((param) => {
    param.obj.email = param.obj.email.toLowerCase();
    return param.value;
  })
  public email: string;

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
  public fullName: string;
}
