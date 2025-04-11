import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeleteResponseDto {
  @Expose()
  message: string;
}
