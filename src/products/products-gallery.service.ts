import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ProductImage } from "./entities/product-image";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsGalleryService {
    constructor(
        @InjectRepository(ProductImage)
        private productImageRepository: Repository<ProductImage>,
    ){}

    async addImages(images: {name: string, path: string}[], product: Product) {
        const savedImages: ProductImage[] = [];
        try {
            for(const image of images) {
                const newImage = this.productImageRepository.create({
                    name: image.name,
                    path: image.path,
                    product: {
                        id: product.id
                    }
                });
                await this.productImageRepository.insert(newImage);
                savedImages.push(newImage);
            }
    
            return savedImages;    
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    private async findProductImages(productId: number): Promise<ProductImage[]> {
        return await this.productImageRepository.find({
            where: {
                product: {
                    id: productId
                }
            }
        });
    }

    async deleteImages(product: Product) {
        const productImages = await this.findProductImages(product.id);
        return await this.productImageRepository.remove(productImages);
    }
}