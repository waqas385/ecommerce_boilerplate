import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'src/users/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductsCategoryService } from './products-category.service';
import { PageRequestDTO } from './dto/pagination/page.request.dto';
import { plainToInstance } from 'class-transformer';

@Controller('products/category')
export class ProductsCategoriesController {
  constructor(private readonly productsCategoryService: ProductsCategoryService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() productCategory: CreateProductCategoryDto) {
    return await this.productsCategoryService.create(productCategory.name);
  }

  @Get('list')
  async findAll(@Query() pageRequestDTO: PageRequestDTO,) {
    const requestDTO = plainToInstance(PageRequestDTO, pageRequestDTO);
    return await this.productsCategoryService.findAll(requestDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Invalid product category id');
    }
    return await this.productsCategoryService.findOneById(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() productCategoryDto: CreateProductCategoryDto) {
    if (!id) {
      throw new BadRequestException('Invalid product category id');
    }
    return this.productsCategoryService.update(+id, productCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Invalid product category id');
    }
    return this.productsCategoryService.remove(+id);
  }
}
