import { AddressDto, ImageDto, LandSizeDto } from 'src/common/dto';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import {
  CommonArea,
  PublicTransport,
  SlopeType,
  SoilType,
  SunPosition,
  ZoningType,
} from '../types';

const numericTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity()
export class Land {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  title: string;

  @Column({ default: false })
  active: boolean;

  @Column({ type: 'jsonb' })
  images: ImageDto[];

  @Column({ type: 'jsonb' })
  address: AddressDto;

  @Column({ type: 'jsonb' })
  landSize: LandSizeDto;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  area?: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  price: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  condominiumTax?: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  propertyTax?: number;

  @Column({ default: false })
  financingAvailable: boolean;

  @Column({ default: false })
  fgts: boolean;

  @Column()
  description: string;

  // What Has
  @Column({ default: false })
  hasWater: boolean;

  @Column({ default: false })
  hasArtesianWell: boolean;

  @Column({ default: false })
  hasSewageSystem: boolean;

  @Column({ default: false })
  hasEletricity: boolean;

  @Column({ default: false })
  hasGas: boolean;

  @Column({ default: false })
  hasInternet: boolean;

  @Column({ default: false })
  isFenced: boolean;

  @Column({ default: false })
  isLandLeveled: boolean;

  @Column({ default: false })
  isLotClear: boolean;

  @Column({
    type: 'enum',
    enum: SoilType,
    default: SoilType.CLAY,
  })
  soil: SoilType;

  @Column({
    type: 'enum',
    enum: SlopeType,
    default: SlopeType.FLAT,
  })
  slope: SlopeType;

  @Column({
    type: 'enum',
    enum: ZoningType,
    default: ZoningType.RESIDENTIAL,
  })
  zoning: ZoningType;

  @Column({
    type: 'enum',
    enum: SunPosition,
    default: SunPosition.EAST,
  })
  sunPosition: SunPosition;

  // Condominuim Status
  @Column({ default: false })
  established: boolean;

  @Column({ default: false })
  paved: boolean;

  @Column({ default: false })
  streetLighting: boolean;

  @Column({ default: false })
  sanitationBasic: boolean;

  @Column({ default: false })
  sidewalks: boolean;

  @Column({ default: false })
  gatedEntrance: boolean;

  @Column({ default: false })
  security: boolean;

  @Column('text', { array: true, nullable: true })
  commonAreas: CommonArea[];

  // NearBy
  @Column('text', { array: true, nullable: true })
  publicTransportation: PublicTransport[];

  @Column({ default: false })
  restaurant: boolean;

  @Column({ default: false })
  school: boolean;

  @Column({ default: false })
  hospital: boolean;

  @Column({ default: false })
  supermarket: boolean;

  @Column({ default: false })
  drugstore: boolean;

  @Column({ default: false })
  gasStation: boolean;

  @Column({ default: false })
  bank: boolean;
}
