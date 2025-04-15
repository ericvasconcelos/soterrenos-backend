import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.params';
import { DeleteResponseDto } from 'src/common/dto/delete-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserTypesEnum } from './dto/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersResponseDto } from './dto/users-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('type/:type')
  async findAllByType(@Param('type') type: UserTypesEnum, @Query() paginationDto?: PaginationDto): Promise<UsersResponseDto> {
    const users = await this.usersService.findAllByType(type, paginationDto);
    return plainToInstance(UsersResponseDto, users)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get('me')
  async findMe(@TokenPayloadParam() tokenPayload: TokenPayloadDto): Promise<UserResponseDto> {
    const user = await this.usersService.findMe(tokenPayload);
    return plainToInstance(UserResponseDto, user)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string, @TokenPayloadParam() tokenPayload: TokenPayloadDto): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id, tokenPayload);
    return plainToInstance(UserResponseDto, user)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const createdUser = await this.usersService.create(createUserDto);
    return plainToInstance(UserResponseDto, createdUser)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    const user = await this.usersService.update(id, updateUserDto, tokenPayload);
    return plainToInstance(UserResponseDto, user)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ): Promise<DeleteResponseDto> {
    return this.usersService.remove(id, tokenPayload);
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
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g
        }).addMaxSizeValidator({
          maxSize: 1 * (1024 * 1024)
        }).build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    ) file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.uploadPicture(file, tokenPayload)
    return plainToInstance(UserResponseDto, user)
  }
}
