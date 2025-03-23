import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'src/users/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { PageRequestDTO } from './dto/pagination/page.request.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() pageRequestDTO: PageRequestDTO) {
    const requestDTO = plainToInstance(PageRequestDTO, pageRequestDTO);
    return this.productsService.findAll(requestDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('here i am in products controller');
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

}
