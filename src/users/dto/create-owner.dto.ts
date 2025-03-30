import { IsString } from 'class-validator';
import { IsCPF } from '../decorators/cpf.decorator';
import { CreateUserDto } from './create-user.dto';

export class CreateOwnerDto extends CreateUserDto {
  @IsString()
  personalName: string;

  @IsString()
  personalLastName: string;

  @IsCPF()
  personalId: string;
}
