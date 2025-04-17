import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Land } from 'src/lands/entities/land.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Land])],
  controllers: [LocationsController],
  providers: [LocationsService]
})
export class LocationsModule {}
