import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @Column('varchar')
    public name: string;

    @Column({
        type: 'int',
        nullable: true,
        default: null
    })
    public parentId: number;

    @ManyToOne(() => Product, (product) => product.category, {
        createForeignKeyConstraints: false
    })
    public products: Product[];
  
    @Column({ default: () => `now()`, nullable: false })
    public createdAt: Date;
    
    @Column({ default: () => 'now()', nullable: false })
    public updatedAt: Date;
    
    @DeleteDateColumn()
    public deletedAt: Date;  
}