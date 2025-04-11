
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseLoginDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}