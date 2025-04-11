import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';
import { SlopeType, SoilType, SunPosition, ZoningType } from '../types';

export class QueryLandDto {
  // Pagination
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  size?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  // Filtros numéricos
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minArea?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxArea?: number;

  @IsOptional()
  @IsBooleanString()
  fgts?: string;

  @IsOptional()
  @IsBooleanString()
  financingAvailable?: string;

  // Infrastructure filters
  @IsOptional()
  @IsBooleanString()
  hasWater?: string;

  @IsOptional()
  @IsBooleanString()
  hasArtesianWell?: string;

  @IsOptional()
  @IsBooleanString()
  hasSewageSystem?: string;

  @IsOptional()
  @IsBooleanString()
  hasEletricity?: string;

  @IsOptional()
  @IsBooleanString()
  isFenced?: string;

  @IsOptional()
  @IsBooleanString()
  isLandLeveled?: string;

  @IsOptional()
  @IsBooleanString()
  isLotClear?: string;

  @IsOptional()
  @IsString()
  @IsIn(['residential', 'commercial', 'industrial'])
  zoning?: ZoningType;

  @IsOptional()
  @IsString()
  @IsIn(['east-facing', 'west-facing'])
  sunPosition?: SunPosition;

  @IsOptional()
  @IsString()
  @IsIn(['clay', 'sand', 'loam'])
  soilType?: SoilType;

  @IsOptional()
  @IsString()
  @IsIn(['downhill', 'uphill', 'flat'])
  slope?: SlopeType;

  // Condominium Filters
  @IsOptional()
  @IsBooleanString()
  established?: string;

  @IsOptional()
  @IsBooleanString()
  paved?: string;

  @IsOptional()
  @IsBooleanString()
  streetLighting?: string;

  @IsOptional()
  @IsBooleanString()
  sanitationBasic?: string;

  @IsOptional()
  @IsBooleanString()
  sidewalks?: string;

  @IsOptional()
  @IsBooleanString()
  gatedEntrance?: string;

  @IsOptional()
  @IsBooleanString()
  security?: string;

  @IsOptional()
  @IsString()
  commonAreas?: string;
}