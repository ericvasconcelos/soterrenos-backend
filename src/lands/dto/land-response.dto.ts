import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { AddressDto, ImageDto, LandSizeDto } from 'src/common/dto';
import {
  CommonArea,
  PublicTransport,
  SlopeType,
  SoilType,
  SunPosition,
  ZoningType,
} from '../types';
import { UserLandResponseDto } from './user-land-response.dto';

@Exclude()
export class LandResponseDto {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  @Type(() => UserLandResponseDto)
  user: UserLandResponseDto;

  @Expose()
  title: string;

  @Expose()
  active: boolean;

  @Expose()
  images: ImageDto[];

  @Expose()
  address: AddressDto;

  @Expose()
  landSize: LandSizeDto;

  @Expose()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  area: number;

  @Expose()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  price: number;

  @Expose()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  condominiumTax?: number;

  @Expose()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  propertyTax?: number;

  @Expose()
  financingAvailable: boolean;

  @Expose()
  fgts: boolean;

  @Expose()
  description: string;

  @Expose()
  hasWater: boolean;

  @Expose()
  hasArtesianWell: boolean;

  @Expose()
  hasSewageSystem: boolean;

  @Expose()
  hasEletricity: boolean;

  @Expose()
  hasGas: boolean;

  @Expose()
  hasInternet: boolean;

  @Expose()
  isFenced: boolean;

  @Expose()
  isLandLeveled: boolean;

  @Expose()
  isLotClear: boolean;

  @Expose()
  soil: SoilType;

  @Expose()
  slope: SlopeType;

  @Expose()
  zoning: ZoningType;

  @Expose()
  sunPosition: SunPosition;

  @Expose()
  established: boolean;

  @Expose()
  paved: boolean;

  @Expose()
  streetLighting: boolean;

  @Expose()
  sanitationBasic: boolean;

  @Expose()
  sidewalks: boolean;

  @Expose()
  gatedEntrance: boolean;

  @Expose()
  security: boolean;

  @Expose()
  commonAreas: CommonArea[]

  @Expose()
  publicTransportation: PublicTransport[]

  @Expose()
  restaurant: boolean;

  @Expose()
  school: boolean;

  @Expose()
  hospital: boolean;

  @Expose()
  supermarket: boolean;

  @Expose()
  drugstore: boolean;

  @Expose()
  gasStation: boolean;

  @Expose()
  bank: boolean;

  @Expose()
  @Type(() => Date)
  createdAt?: Date;

  @Expose()
  @Type(() => Date)
  updatedAt?: Date;
}
