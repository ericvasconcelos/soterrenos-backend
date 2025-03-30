import { IsString } from 'class-validator';
import { IsCNPJ } from '../decorators/cnpj.decorator';
import { CreateUserDto } from './create-user.dto';

export class CreateAgencyDto extends CreateUserDto {
  @IsString()
  legalName: string;

  @IsString()
  tradeName: string;

  @IsCNPJ()
  companyId: string;
}
