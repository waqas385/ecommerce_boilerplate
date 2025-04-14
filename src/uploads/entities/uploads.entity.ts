import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Uploads {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @Column('varchar')
    public fileName: string;
  
    @Column({ type: 'text', nullable: true })
    public description: string;
  
    @Column({ default: () => `now()`, nullable: false })
    public createdAt: Date;
  
    @Column({ default: () => 'now()', nullable: false })
    public updatedAt: Date;
  
    @DeleteDateColumn()
    public deletedAt: Date;
}
