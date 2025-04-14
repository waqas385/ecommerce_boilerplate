import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from '../constants/regex.constants';
import { Transform } from 'class-transformer';
import { Role } from '../enum/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(EMAIL_REGEX, {
    message: 'Valid email is required',
  })
  @Transform((param) => {
    param.obj.email = param.obj.email.toLowerCase();
    return param.value;
  })
  public email: string;

  @IsEnum(Role)
  @IsOptional()
  public role: Role.User;

  @IsString()
  @Matches(PHONE_NUMBER_REGEX, {
    message: 'Valid phone number is required',
  })
  public phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsOptional()
  @IsString()
  public profilePhoto: string;
}
