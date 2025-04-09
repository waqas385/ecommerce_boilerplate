import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductCategory } from './entities/product-category';
import { ProductImage } from './entities/product-image';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsGalleryService } from './products-gallery.service';
import { ProductsCategoryService } from './products-category.service';
import { ProductsCategoriesController } from './products-categories.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, ProductImage])
  ],
  controllers: [ProductsController, ProductsCategoriesController],
  providers: [
    ProductsService,
    ProductsGalleryService,
    ProductsCategoryService
  ],
})
export class ProductsModule {}
