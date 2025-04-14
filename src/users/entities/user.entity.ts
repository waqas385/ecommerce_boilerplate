import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar')
  public fullName: string;

  @Column('varchar')
  public email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  public role: Role;

  @Column({ type: 'varchar', default: null, nullable: true })
  public phoneNumber: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  public otp: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  public profilePhoto: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  public country: string;

  @Column('varchar')
  public password: string;

  @Column({ default: () => `now()`, nullable: false })
  public createdAt: Date;

  @Column({ default: () => 'now()', nullable: false })
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
