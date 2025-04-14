import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { PageResponseDTO } from './dto/pagination/page.response.dto';
import { PageRequestDTO } from './dto/pagination/page.request.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  async findAll(@Query() pageRequestDTO: PageRequestDTO): Promise<PageResponseDTO<User>> {
    const requestDTO = plainToInstance(PageRequestDTO, pageRequestDTO);
    return await this.usersService.findAll(requestDTO);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const requestDTO = plainToInstance(UpdateUserDto, updateUserDto);
    return this.usersService.update(+id, requestDTO);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
