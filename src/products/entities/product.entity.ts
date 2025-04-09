import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "./product-category";
import { ProductImage } from "./product-image";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @Column('varchar')
    public name: string;
  
    @Column({ type: 'text', nullable: true })
    public description: string;
  
    @Column({ type: 'int', nullable: false })
    public quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    public price: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 15.00 })
    public vat: number;  

    @Column({ default: () => `now()`, nullable: false })
    public createdAt: Date;
  
    @Column({ default: () => 'now()', nullable: false })
    public updatedAt: Date;
  
    @DeleteDateColumn()
    public deletedAt: Date;

    @OneToOne(() => ProductCategory, (productCategory) => productCategory.id, {
        createForeignKeyConstraints: false
    })
    @JoinColumn()
    category: ProductCategory

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    gallery: ProductImage[]
}
