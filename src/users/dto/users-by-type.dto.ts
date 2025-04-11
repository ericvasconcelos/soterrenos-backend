import { IsEnum } from 'class-validator';
import { UserTypeEnum } from './types';

export class UserByTypeDto {
  @IsEnum(['agency', 'owner', 'salesperson'])
  type: UserTypeEnum;
}
