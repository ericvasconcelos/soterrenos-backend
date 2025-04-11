import { ApiProperty } from '@nestjs/swagger';
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
import { StateType, UserTypeEnum } from './types';

export class CreateUserDto {
  @IsEnum(['agency', 'owner', 'salesperson'])
  type: UserTypeEnum;

  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Teste@123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/, {
    message:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
  })
  password: string;

  @ApiProperty({ example: '(61) 9999-9999' })
  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
    message: 'Phone number must be in format (XX) XXXX-XXXX or (XX) XXXXX-XXXX',
  })
  phoneNumber: string;

  @ApiProperty({ example: '(61) 99999-9999' })
  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
  whatsappNumber: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  profileImage?: ImageDto;

  // owner and salesperson
  @ApiProperty({ example: 'Eric' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  personalFirstName?: string;

  @ApiProperty({ example: 'Vasconcelos' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  personalLastName?: string;

  @ApiProperty({ example: '123.456.789-10' })
  @IsOptional()
  @IsCPF()
  @Length(14, 14)
  personalId?: string;

  // salesperson
  @ApiProperty({ example: '123456' })
  @IsOptional()
  @IsString()
  creci?: string;

  @IsOptional()
  @IsEnum(['DF', 'GO'])
  creciState?: StateType;

  // agency
  @ApiProperty({ example: 'COMPANY LANDS LTDA' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  legalName?: string;

  @ApiProperty({ example: 'Lands Seller' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  tradeName?: string;

  @ApiProperty({ example: '65.457.148/0001-03' })
  @IsOptional()
  @IsCNPJ()
  @Length(18, 18)
  companyId?: string;
}
