// src/users/dto/create-user.dto.ts
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

class ProfileImageDto {
  @IsString()
  src: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  alt?: string;
}

export class CreateUserDto {
  @IsEnum(['agency', 'owner', 'salesperson'])
  type: 'agency' | 'owner' | 'salesperson';

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/, {
    message:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
  })
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
    message: 'Phone number must be in format (XX) XXXX-XXXX or (XX) XXXXX-XXXX',
  })
  phoneNumber: string;

  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
  whatsappNumber: string;

  @ValidateNested()
  @Type(() => ProfileImageDto)
  @IsOptional()
  profileImage?: ProfileImageDto;
}
