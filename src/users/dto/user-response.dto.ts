import { Exclude, Expose, Type } from 'class-transformer';
import { ImageDto } from 'src/common/dto';
import { UserTypesEnum } from './types';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: UserTypesEnum;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  whatsappNumber: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @Expose()
  profileImage?: ImageDto;

  @Expose()
  legalName?: string;

  @Expose()
  tradeName?: string;

  @Expose()
  companyId?: string;

  @Expose()
  personalFirstName?: string;

  @Expose()
  personalLastName?: string;

  @Expose()
  personalId?: string;

  @Expose()
  creci?: string;

  @Expose()
  creciState?: string;

  @Expose()
  activeLandsCount?: number;
}
