import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductGallery {
    @PrimaryGeneratedColumn()
    public id: number;
      
    @Column('varchar')
    public name: string;

    @Column('varchar')
    public path: string;

    @ManyToOne(() => Product, (product) => product.gallery, {
        createForeignKeyConstraints: false
    })
    product: Product
}