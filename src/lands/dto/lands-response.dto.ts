import { Exclude, Expose, Type } from 'class-transformer';
import { LandResponseDto } from './land-response.dto';

@Exclude()
export class LandsResponseDto {
  @Expose()
  @Type(() => LandResponseDto)
  data: LandResponseDto[];

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
