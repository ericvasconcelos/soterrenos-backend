import { Exclude, Expose } from 'class-transformer';


@Exclude()
export class UserLandResponseDto {
  @Expose()
  id: string;
}