import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'agency' | 'owner' | 'salesperson';

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ name: 'confirmation_token', nullable: true })
  confirmationToken: string;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  profileImage: {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}

@Entity()
export class Agency extends User {
  @Column({ name: 'legal_name' })
  legalName: string;

  @Column({ name: 'trade_name' })
  tradeName: string;

  @Column({ name: 'company_id' })
  companyId: string;
}

@Entity()
export class Owner extends User {
  @Column({ name: 'personal_name' })
  personalName: string;

  @Column({ name: 'personal_last_name' })
  personalLastName: string;

  @Column({ name: 'personal_id' })
  personalId: string;
}

@Entity()
export class Salesperson extends User {
  @Column({ name: 'personal_name' })
  personalName: string;

  @Column({ name: 'personal_last_name' })
  personalLastName: string;

  @Column({ name: 'personal_id' })
  personalId: string;

  @Column()
  creci: string;

  @Column({ name: 'creci_state', length: 2 })
  creciState: string;
}
