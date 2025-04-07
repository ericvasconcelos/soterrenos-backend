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
  UseGuards,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadParam } from './../auth/params/token-payload.params';
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

  @UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createLandDto: CreateLandDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.landsService.create(createLandDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLandDto: UpdateLandDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.landsService.update(id, updateLandDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.landsService.remove(id, tokenPayload);
  }
}
