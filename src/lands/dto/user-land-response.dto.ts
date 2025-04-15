import { Exclude, Expose } from 'class-transformer';
import { ImageDto } from 'src/common/dto';
import { UserTypesEnum } from 'src/users/dto/types';

@Exclude()
export class UserLandResponseDto {
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
  profileImage?: ImageDto;

  @Expose()
  personalFirstName?: string;

  @Expose()
  personalLastName?: string;

  @Expose()
  tradeName?: string;
}
