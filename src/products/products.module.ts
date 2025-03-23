import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductCategory } from './entities/product-category';
import { ProductGallery } from './entities/product-gallery';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsGalleryService } from './products-gallery.service';
import { ProductsCategoryService } from './products-category.service';
import { ProductsCategoriesController } from './products-categories.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, ProductGallery])
  ],
  controllers: [ProductsController, ProductsCategoriesController],
  providers: [
    ProductsService,
    ProductsGalleryService,
    ProductsCategoryService
  ],
})
export class ProductsModule {}
