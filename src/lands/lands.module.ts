import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Land } from './entities/land.entity';
import { LandsController } from './lands.controller';
import { LandsService } from './lands.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Land]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
  ],
  providers: [LandsService],
  controllers: [LandsController],
})
export class LandsModule { }
