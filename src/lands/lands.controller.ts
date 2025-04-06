import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { LandsService } from './lands.service';

@Controller('lands')
export class LandsController {
  constructor(private readonly landsService: LandsService) { }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const lands = await this.landsService.findAll(paginationDto);
    return lands;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landsService.findOne(id);
  }

  @Post()
  create(@Body() createLandDto: CreateLandDto) {
    return this.landsService.create(createLandDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLandDto: UpdateLandDto) {
    return this.landsService.update(id, updateLandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landsService.remove(id);
  }
}
