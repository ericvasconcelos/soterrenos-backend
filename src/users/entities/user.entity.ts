import { IsEmail } from 'class-validator';
import { ImageDto } from 'src/common/dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'agency' | 'owner' | 'salesperson';

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column()
  phoneNumber: string;

  @Column()
  whatsappNumber: string;

  @Column({ default: false })
  isConfirmed?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  profileImage?: ImageDto;

  @Column({ length: 255, default: '' })
  personalFirstName?: string;

  @Column({ length: 255, default: '' })
  personalLastName?: string;

  @Column({ length: 14, default: '' })
  personalId?: string;

  @Column({ length: 255, default: '' })
  legalName?: string;

  @Column({ length: 255, default: '' })
  tradeName?: string;

  @Column({ length: 18, default: '' })
  companyId?: string;

  @Column({ length: 25, default: '' })
  creci?: string;

  @Column({ length: 2, default: '' })
  creciState?: string;
}
