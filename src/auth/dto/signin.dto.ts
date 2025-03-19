import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches } from 'class-validator';
import { EMAIL_REGEX } from 'src/users/constants/regex.constants';

export class SignInDto {
  @IsEmail()
  @Matches(EMAIL_REGEX, {
    message: 'Valid email is required',
  })
  @Transform((param) => {
    param.obj.email = param.obj.email.toLowerCase();
    return param.value;
  })
  public email: string;

  @IsString()
  public password: string;
}
