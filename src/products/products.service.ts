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
  async create(createProductDto: CreateProductDto) {
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
    if (createProductDto.images) {
      product.gallery = await this.productGalleryService.addImages(createProductDto.images, product.id);
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
    
    queryBuilder.orderBy('id', pageRequestDTO.order)
    .skip(pageRequestDTO.skip)
    .take(pageRequestDTO.take);

    if (pageRequestDTO.search) {
        queryBuilder.andWhere('name like :search ', {
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

}
