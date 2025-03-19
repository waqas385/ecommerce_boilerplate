import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { CommonService } from 'src/common/common.service';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { Role } from './enum/role.enum';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private commonService: CommonService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.usersRepository.find();
    // return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async signin(signInDto: SignInDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });

    if (!user) {
      throw new BadRequestException('Email does not exists');
    }

    const isValidPassword = await this.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private comparePassword(enteredPassword, savedPassword): boolean {
    return this.commonService.compareText(enteredPassword, savedPassword);
  }

  async signup(signUpDto: SignUpDto): Promise<any> {
    // check for email already exists
    const isEmailExists = await this.usersRepository.findOneBy({
      email: signUpDto.email,
    });

    if (isEmailExists) {
      throw new ConflictException('Email already exists');
    }

    // compare password
    const isPasswordMatch =
      signUpDto.password.toLowerCase() ===
      signUpDto.confirmPassword.toLowerCase();
    if (!isPasswordMatch) {
      throw new BadRequestException('Passwords does not match');
    }

    const encryptPassword = await this.commonService.encrypt(
      signUpDto.password,
    );
    const otp = this.commonService.generateOtp();
    const user = this.usersRepository.create({
      fullName: signUpDto.fullName,
      email: signUpDto.email,
      password: encryptPassword,
      role: Role.User,
      otp: otp + '_' + new Date().getTime(),
    });

    return await this.usersRepository.insert(user);
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({
      email
    });

    if (!user) {
      throw new BadRequestException('Email does not exists');
    }
    
    const otp = this.commonService.generateOtp();
    user.otp = otp + '_' + new Date().getTime();
    await this.usersRepository.save(user);

    // generate encrypted token to open reset-password link
    const text = user.email + '^' + otp;
    return this.commonService.encrypt(text);
  }

  async isVerifiedEmailOTP(email: string, otp: string): Promise<boolean> {
    
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Email does not exists');
    }

    const isCorrectOTP = await this.commonService.verifyOTP(user.otp, otp);
    if (!isCorrectOTP) {
      throw new BadRequestException('Incorrect or expired OTP is passed');
    }

    return true;
  }

  async resetPassword(password: string, email: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Email does not exists');
    }

    const otp = this.commonService.generateOtp();
    user.otp = otp + '_' + new Date().getTime();
    user.password = this.commonService.encrypt(password);
    return await this.usersRepository.save(user);
  }
}
