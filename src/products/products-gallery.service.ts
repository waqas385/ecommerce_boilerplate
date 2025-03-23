import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ProductGallery } from "./entities/product-gallery";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductsGalleryService {
    constructor(
        @InjectRepository(ProductGallery)
        private productGalleryRepository: Repository<ProductGallery>,
    ){}

    async addImages(images: {name: string, path: string}[], productId: number) {
        const savedImages: ProductGallery[] = [];
        try {
            for(const image of images) {
                const newImage = this.productGalleryRepository.create({
                    name: image.name,
                    path: image.path,
                    product: {
                        id: productId
                    }
                });
                await this.productGalleryRepository.insert(newImage);
                savedImages.push(newImage);
            }
    
            return savedImages;    
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}