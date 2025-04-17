import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DeleteResponseDto } from '../common/dto/delete-response.dto';
import { TokenPayloadParam } from './../auth/params/token-payload.params';
import { CreateLandDto } from './dto/create-land.dto';
import { LandResponseDto } from './dto/land-response.dto';
import { LandsResponseDto } from './dto/lands-response.dto';
import { QueryLandDto } from './dto/query-land.dto';
import { QueryUserLandsDto } from './dto/query-user-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { LandsService } from './lands.service';

@Controller('lands')
export class LandsController {
  constructor(private readonly landsService: LandsService) { }

  @Get()
  async findAll(@Query() paginationDto?: PaginationDto): Promise<LandResponseDto[]> {
    const lands = await this.landsService.findAll(paginationDto);
    return plainToInstance(LandResponseDto, lands)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LandResponseDto> {
    const land = await this.landsService.findOne(id);
    return plainToInstance(LandResponseDto, land)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createLandDto: CreateLandDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto): Promise<LandResponseDto> {
    const land = await this.landsService.create(createLandDto, tokenPayload);
    return plainToInstance(LandResponseDto, land)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLandDto: UpdateLandDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ): Promise<LandResponseDto> {
    const land = await this.landsService.update(id, updateLandDto, tokenPayload);
    return plainToInstance(LandResponseDto, land)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @TokenPayloadParam() tokenPayload: TokenPayloadDto): Promise<DeleteResponseDto> {
    return this.landsService.remove(id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  @Post('upload-files')
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.landsService.uploadFiles(files)
  }

  @Get('user/:id')
  async findLandsByUser(@Param('id') id: string, @Query() queryUserLands?: QueryUserLandsDto): Promise<LandsResponseDto> {
    const land = await this.landsService.findLandsByUser(id, queryUserLands);
    return plainToInstance(LandsResponseDto, land)
  }

  @Get(':state/:city')
  async searchLands(
    @Param('state') state: string,
    @Param('city') city: string,
    @Query() queryLandDto?: QueryLandDto
  ) {
    const lands = await this.landsService.searchLands(state, city, queryLandDto);
    return plainToInstance(LandsResponseDto, lands)
  }
}
