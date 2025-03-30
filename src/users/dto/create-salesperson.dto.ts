import { IsString, Length } from 'class-validator';
import { IsCPF } from '../decorators/cpf.decorator';
import { CreateUserDto } from './create-user.dto';

export class CreateSalespersonDto extends CreateUserDto {
  @IsString()
  personalName: string;

  @IsString()
  personalLastName: string;

  @IsCPF()
  personalId: string;

  @IsString()
  creci: string;

  @IsString()
  @Length(2, 2)
  creciState: string;
}
