import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsGalleryService } from './products-gallery.service';
import { ProductsCategoryService } from './products-category.service';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequestDTO } from './dto/pagination/page.request.dto';
import { PageResponseDTO } from './dto/pagination/page.response.dto';
import { PageMetaDTO } from './dto/pagination/page.meta.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private productGalleryService: ProductsGalleryService,
    private productCategoryService: ProductsCategoryService,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (await this.productWithNameAlreadyExists(createProductDto.name)) {
      throw new ConflictException(`Product with name ${createProductDto.name} already exists`)
    }

    const category = await this.productCategoryService.findOne(createProductDto.category);
    const product = this.productRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      vat: createProductDto.vat,
      quantity: createProductDto.quantity,
      category
    });

    await this.productRepository.insert(product);
    if (createProductDto.gallery) {
      product.gallery = await this.productGalleryService.addImages(createProductDto.gallery, product);
    }

    return product;
  }

  private async productWithNameAlreadyExists(name: string) {
    const product = await this.productRepository.findOne({
      where: {
        name: Like(`%${name}%`)
      }
    });

    return !product ? false : true;
  }

  async findAll(pageRequestDTO: PageRequestDTO,): Promise<PageResponseDTO<Product>> {
    const queryBuilder = this.productRepository.createQueryBuilder();
    
    queryBuilder.orderBy('Product.id', pageRequestDTO.order)
    .leftJoinAndSelect('Product.gallery', 'gallery')
    .skip(pageRequestDTO.skip)
    .take(pageRequestDTO.take);

    if (pageRequestDTO.search) {
      // PGSQL - LOWER
      queryBuilder.andWhere('LOWER(Product.name) like LOWER(:search) ', {
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

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      relations: {
        gallery: true,
        category: true
      },
      where: {
        id
      }
    });

    if (!product) {
      throw new BadRequestException('Invalid product id');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    for (const field in updateProductDto) {
      if (updateProductDto[field] && product[field]) {
        product[field] = updateProductDto[field];
      }
    }

    if (updateProductDto.category) {
      const category = await this.productCategoryService.findOne(updateProductDto.category);
      product.category = category;
    }

    if (product.gallery) {
      await this.productGalleryService.deleteImages(product);
      product.gallery = await this.productGalleryService.addImages(product.gallery, product);
    }

    await this.productRepository.save(product);
    return product;
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    await this.productGalleryService.deleteImages(product);

    // Delete product
    await this.productRepository.remove(product);

    return {
      message: 'Record deleted successfully'
    };
  }

}
