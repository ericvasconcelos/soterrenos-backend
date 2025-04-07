import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { AddressDto, ImageDto, LandSizeDto } from 'src/common/dto';

@Exclude()
export class LandResponseDto {
  @Expose()
  id: string;

  @Expose()
  slug: string;

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
  price: number;

  @Expose()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  condominiumTax: number;

  @Expose()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  propertyTax: number;

  @Expose()
  financingAvailable: boolean;

  @Expose()
  fgts: boolean;

  @Expose()
  description: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
