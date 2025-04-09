import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ImageDto } from 'src/common/dto';
import { IsCNPJ } from '../decorators/cnpj.decorator';
import { IsCPF } from '../decorators/cpf.decorator';
import { UserType } from './user-type';

export class CreateUserDto {
  @IsEnum(['agency', 'owner', 'salesperson'])
  type: UserType;

  @IsEmail()
  email: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/, {
    message:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
  })
  password: string;

  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
    message: 'Phone number must be in format (XX) XXXX-XXXX or (XX) XXXXX-XXXX',
  })
  phoneNumber: string;

  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
  whatsappNumber: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  profileImage?: ImageDto;

  // owner and salesperson
  @IsOptional()
  @IsString()
  @Length(2, 255)
  personalFirstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  personalLastName?: string;

  @IsOptional()
  @IsCPF()
  @Length(14, 14)
  personalId?: string;

  // salesperson
  @IsOptional()
  @IsString()
  creci?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  creciState?: string;

  // agency
  @IsOptional()
  @IsString()
  @Length(2, 255)
  legalName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  tradeName?: string;

  @IsOptional()
  @IsCNPJ()
  @Length(18, 18)
  companyId?: string;
}
