import { Body, Controller, Post } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CreateSalespersonDto } from './dto/create-salesperson.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Post()
  // async create(@Body() userInfos: CreateUserDto, @Res() res: Response) {
  //   const response = await this.usersService.create(userInfos);

  //   res.status(HttpStatus.OK).json(response);
  // }

  @Post('agency')
  async registerAgency(@Body() createAgencyDto: CreateAgencyDto) {
    return this.usersService.createAgency(createAgencyDto);
  }

  @Post('owner')
  async registerOwner(@Body() createOwnerDto: CreateOwnerDto) {
    return this.usersService.createOwner(createOwnerDto);
  }

  @Post('salesperson')
  async registerSalesperson(
    @Body() createSalespersonDto: CreateSalespersonDto,
  ) {
    return this.usersService.createSalesperson(createSalespersonDto);
  }
}
