import { IsEmail, IsString } from 'class-validator';

export class MailDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  token: string;
}
