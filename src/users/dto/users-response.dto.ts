import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

@Exclude()
export class UsersResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  data: UserResponseDto[];

  @Expose()
  count: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number | null;

  @Expose()
  nextPage: number | null;

  @Expose()
  prevPage: number | null;
}
