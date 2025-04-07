import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import { AddressDto, ImageDto, LandSizeDto } from 'src/common/dto';
import {
  CommonArea,
  PublicTransport,
  SlopeType,
  SoilType,
  SunPosition,
  ZoningType,
} from '../types';

export class CreateLandDto {
  @IsString({ message: 'TITLE_MUST_STRING' })
  @IsNotEmpty({ message: 'TITLE_REQUIRED' })
  @MinLength(5, { message: 'TITLE_MIN_LENGTH_5' })
  title: string;

  @IsBoolean()
  active: boolean;

  @IsArray({ message: 'IMAGES_MUST_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => LandSizeDto)
  landSize: LandSizeDto;

  @IsPositive({ message: 'PRICE_POSITIVE' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'PRICE_NUMBER' })
  price: number;

  @IsOptional()
  @Min(0, { message: 'CONDOMINIUM_TAX_NON_NEGATIVE' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'CONDOMINIUM_TAX_NUMBER' })
  condominiumTax?: number;

  @IsOptional()
  @Min(0, { message: 'PROPERTY_TAX_NON_NEGATIVE' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'PROPERTY_TAX_NUMBER' })
  propertyTax?: number;

  @IsOptional()
  @IsBoolean()
  financingAvailable: boolean;

  @IsOptional()
  @IsBoolean()
  fgts: boolean;

  @IsString({ message: 'DESCRIPTION_MUST_STRING' })
  @IsNotEmpty({ message: 'DESCRIPTION_REQUIRED' })
  @MinLength(20, { message: 'DESCRIPTION_MIN_LENGTH_20' })
  description: string;

  // What Has
  @IsBoolean()
  hasWater: boolean;

  @IsBoolean()
  hasArtesianWell: boolean;

  @IsBoolean()
  hasSewageSystem: boolean;

  @IsBoolean()
  hasEletricity: boolean;

  @IsBoolean()
  hasGas: boolean;

  @IsBoolean()
  hasInternet: boolean;

  @IsBoolean()
  isFenced: boolean;

  @IsBoolean()
  isLandLeveled: boolean;

  @IsBoolean()
  isLotClear: boolean;

  @IsString()
  @IsIn(['clay', 'sandy', 'rocky'])
  soil: SoilType;

  @IsString()
  @IsIn(['downhill', 'uphill', 'flat'])
  slope: SlopeType;

  @IsString()
  @IsIn(['residential', 'commercial', 'industrial'])
  zoning: ZoningType;

  @IsString()
  @IsIn(['east-facing', 'west-facing'])
  sunPosition: SunPosition;

  // Condominium Status
  @IsBoolean()
  established: boolean;

  @IsBoolean()
  paved: boolean;

  @IsBoolean()
  streetLighting: boolean;

  @IsBoolean()
  sanitationBasic: boolean;

  @IsBoolean()
  sidewalks: boolean;

  @IsBoolean()
  gatedEntrance: boolean;

  @IsBoolean()
  security: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsIn(
    [
      'sports_court',
      'party_hall',
      'gym',
      'swimming_pool',
      'sauna',
      'playground',
    ],
    { each: true },
  )
  commonAreas: CommonArea[];

  // Near By
  @IsArray()
  @IsString({ each: true })
  @IsIn(['train', 'subway', 'bus'], { each: true })
  publicTransportation: PublicTransport[];

  @IsBoolean()
  restaurant: boolean;

  @IsBoolean()
  school: boolean;

  @IsBoolean()
  hospital: boolean;

  @IsBoolean()
  supermarket: boolean;

  @IsBoolean()
  drugstore: boolean;

  @IsBoolean()
  gasStation: boolean;

  @IsBoolean()
  bank: boolean;
}
