import { IsBooleanString, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class QueryUserLandsDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  active?: string;
}