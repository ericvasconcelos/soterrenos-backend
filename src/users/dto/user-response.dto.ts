import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

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
  profileImage?: {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
  };

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
}
