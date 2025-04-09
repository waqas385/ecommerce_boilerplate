import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { ProductCategory } from "./entities/product-category";
import { PageRequestDTO } from "./dto/pagination/page.request.dto";
import { PageResponseDTO } from "./dto/pagination/page.response.dto";
import { PageMetaDTO } from "./dto/pagination/page.meta.dto";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsCategoryService {
    constructor(
        @InjectRepository(ProductCategory)
        private productCategoryRepository: Repository<ProductCategory>,
    ) { }

    async findOne(name: string) {
        const productGallery = await this.productCategoryRepository.findOne({
            where: {
                name: Like(`%${name}%`)
            }
        });

        if (!productGallery) {
            throw new BadRequestException('Invalid product category ' + name);
        }

        return productGallery;
    }

    private async categoryAlreadyExists(name: string) {
        const category = await this.productCategoryRepository.findOne({
            where: {
                name: Like(`%${name}%`)
            }
        });

        return !category ? false : true;
    }

    async create(name: string) {
        if (await this.categoryAlreadyExists(name)) {
            throw new ConflictException(`Category with name: ${name} already exists.`);
        }
        const category = this.productCategoryRepository.create({
            name
        });

        await this.productCategoryRepository.insert(category);
        return category;
    }

    async findAll(pageRequestDTO: PageRequestDTO,): Promise<PageResponseDTO<ProductCategory>> {
        const queryBuilder = this.productCategoryRepository.createQueryBuilder();

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

    async findOneById(id: number) {
        if (!id) {
            throw new BadRequestException('Invalid product category id');
        }

        const category = await this.productCategoryRepository.findOneBy({ id });

        if (!category) {
            throw new BadRequestException('Invalid product category id');
        }

        return category;
    }

    async update(id: number, productCategoryDto: CreateProductCategoryDto) {
        const category = await this.findOneById(id);
        category.name = productCategoryDto.name;
        if (productCategoryDto.parentId) {
            category.parentId = productCategoryDto.parentId;
        }

        await this.productCategoryRepository.save(category);
        return category;
    }

    async remove(id: number) {
        const category = await this.findOneById(id);
        return await this.productCategoryRepository.remove(category);
    }
}