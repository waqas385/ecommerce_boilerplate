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
import { PageResponseDTO } from './dto/pagination/page.response.dto';
import { PageRequestDTO } from './dto/pagination/page.request.dto';
import { PageMetaDTO } from './dto/pagination/page.meta.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private commonService: CommonService,
  ) {}

  private async isEmailExists(email: string) {
    const isEmailExists = await this.usersRepository.findOneBy({
      email
    });

    if (isEmailExists) {
      throw new ConflictException('Email already exists');
    }

    return isEmailExists;
  }

  private async isPhoneNumberExists(phoneNumber: string) {
    const isPhoneNumberExists = await this.usersRepository.findOneBy({
      phoneNumber
    });

    if (isPhoneNumberExists) {
      throw new ConflictException('Phone number already exists');
    }

    return isPhoneNumberExists;
  }

  async create(createUserDto: CreateUserDto) {
    // check for email already in use
    await this.isEmailExists(createUserDto.email);

    // check for phone number already in use
    await this.isPhoneNumberExists(createUserDto.phoneNumber);

    const encryptPassword = await this.commonService.encrypt(
      createUserDto.password,
    );
    const otp = this.commonService.generateOtp();
    const user = this.usersRepository.create({
      fullName: createUserDto.fullName,
      phoneNumber: createUserDto.phoneNumber,
      email: createUserDto.email,
      password: encryptPassword,
      role: Role.User,
      otp: otp + '_' + new Date().getTime(),
      profilePhoto: createUserDto.profilePhoto
    });

    await this.usersRepository.insert(user);

    return user;
  }

  async findAll(pageRequestDTO: PageRequestDTO,): Promise<PageResponseDTO<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder();
        
    queryBuilder.orderBy('User.id', pageRequestDTO.order)
    .skip(pageRequestDTO.skip)
    .take(pageRequestDTO.take);

    if (pageRequestDTO.search) {
      // PGSQL - LOWER
      queryBuilder.andWhere('LOWER(User.fullName) like LOWER(:search) ', {
          search: `%${pageRequestDTO.search}%`,
      });
    }
  
    const itemCount = await queryBuilder.getCount();
    const { entities }: any = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDTO({
        itemCount,
        page: pageRequestDTO.page,
        take: pageRequestDTO.take,
    });

    return new PageResponseDTO(await Promise.all(entities), pageMetaDto);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id
      }
    });

    if (!user) {
      throw new BadRequestException('Invalid user id');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    for (const updateUserProperty in updateUserDto) {
      user[updateUserProperty] = updateUserDto[updateUserProperty];
    }

    if (updateUserDto.password) {
      user.password = await this.commonService.encrypt(
        user.password,
      );
    }

    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new BadRequestException('Invalid user id');
    }

    await this.usersRepository.delete(id);

    return {
      message: 'User deleted successfully'
    }
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
