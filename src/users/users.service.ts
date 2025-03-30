import { Injectable } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CreateSalespersonDto } from './dto/create-salesperson.dto';

@Injectable()
export class UsersService {
  async createAgency(userInfos: CreateAgencyDto): Promise<CreateAgencyDto> {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    return userInfos;
  }

  async createOwner(userInfos: CreateOwnerDto): Promise<CreateOwnerDto> {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    return userInfos;
  }

  async createSalesperson(
    userInfos: CreateSalespersonDto,
  ): Promise<CreateSalespersonDto> {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    return userInfos;
  }
}
