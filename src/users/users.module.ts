import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency, Owner, Salesperson, User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Agency, Owner, Salesperson])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
