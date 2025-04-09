import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'src/users/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { PageRequestDTO } from './dto/pagination/page.request.dto';
import { Product } from './entities/product.entity';
import { PageResponseDTO } from './dto/pagination/page.response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() pageRequestDTO: PageRequestDTO): Promise<PageResponseDTO<Product>> {
    const requestDTO = plainToInstance(PageRequestDTO, pageRequestDTO);
    return await this.productsService.findAll(requestDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    if (isNaN(+id)) {
      throw new BadRequestException('Invalid product id');
    }
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('Invalid product id');
    }
    return this.productsService.remove(+id);
  }
}
