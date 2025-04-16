/* eslint-disable @typescript-eslint/no-unused-vars */


import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { filetypeextension } from 'magic-bytes.js';
import * as sharp from 'sharp';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { ErrorsEnum } from 'src/common/constants/errors.constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { bucket } from 'src/common/image-cloud/config';
import { Land } from 'src/lands/entities/land.entity';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRolesEnum, UserTypesEnum } from './dto/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';


interface LandCountResult {
  userId: string;
  count: string;
}


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Land)
    private readonly landsRepository: Repository<Land>,
    private readonly hashingService: HashingService,
    private readonly mailService: MailService,
  ) { }

  async findAllByType(type: UserTypesEnum, paginationDto?: PaginationDto) {
    const page = paginationDto?.page ?? 1;
    const size = paginationDto?.size ?? 10;
    const offset = (page - 1) * size;

    const [users, total] = await this.usersRepository.findAndCount({
      where: { type },
      order: { createdAt: 'DESC' },
      take: size,
      skip: offset,
    });

    const userIds = users.map((user) => user.id);

    let landsCounts = [];
    if (userIds.length > 0) {
      landsCounts = await this.landsRepository
        .createQueryBuilder('land')
        .select('land.userId', 'userId') // Nome correto da coluna
        .addSelect('COUNT(land.id)', 'count')
        .where('land.userId IN (:...userIds)', { userIds }) // Filtro correto
        .andWhere('land.active = :active', { active: true })
        .groupBy('land.userId') // Agrupamento correto
        .getRawMany();
    }

    const countsMap = new Map<string, number>(
      (landsCounts as LandCountResult[]).map((lc) => [
        lc.userId,
        parseInt(lc.count, 10) || 0 // Usar fallback seguro
      ])
    );

    const data = users.map((user) => ({
      ...user,
      activeLandsCount: countsMap.get(user.id) || 0,
    }));

    const lastPage = Math.ceil(total / size);

    return {
      data,
      count: total,
      currentPage: page,
      lastPage,
      nextPage: page + 1 > lastPage ? null : page + 1,
      prevPage: page - 1 < 1 ? null : page - 1,
    };
  }

  async findMe({ sub }: TokenPayloadDto) {
    const user = await this.usersRepository.findOneBy({ id: sub });
    if (!user) throw new NotFoundException(ErrorsEnum.USER_NOT_FOUND);
    return user;
  }

  async findOne(id: string, tokenPayload: TokenPayloadDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(ErrorsEnum.USER_NOT_FOUND);
    if (user?.id !== tokenPayload?.sub) throw new ForbiddenException(ErrorsEnum.DONT_HAVE_PERMISSION)
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashingService.hash(createUserDto.password);

    try {
      const userData = {
        ...createUserDto,
        role: UserRolesEnum.USER,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newUser = this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);

      await this.mailService.sendActivationEmail({
        email: newUser.email,
        name: newUser?.personalFirstName ?? newUser?.tradeName ?? '',
        token: randomUUID()
      })
      return newUser;
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException(ErrorsEnum.EMAIL_ALREADY_REGISTERED);
      }

      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, tokenPayload: TokenPayloadDto) {
    const useData = {
      ...updateUserDto,
      isConfirmed: updateUserDto?.isConfirmed ?? false,
      updatedAt: new Date(),
    }

    if (updateUserDto.password) {
      const hashedPassword = await this.hashingService.hash(updateUserDto.password)
      useData['password'] = hashedPassword
    }

    const user = await this.usersRepository.preload({
      id,
      ...useData
    });

    if (!user) throw new NotFoundException(ErrorsEnum.USER_NOT_FOUND);
    if (user.id !== tokenPayload?.sub) throw new ForbiddenException(ErrorsEnum.DONT_HAVE_PERMISSION)

    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: string, tokenPayload: TokenPayloadDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(ErrorsEnum.USER_NOT_FOUND);
    if (id !== tokenPayload?.sub) throw new ForbiddenException(ErrorsEnum.DONT_HAVE_PERMISSION)
    await this.usersRepository.remove(user);
    return {
      message: 'USER_DELETED'
    }
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    const ALLOWED_MIME_TYPES = new Set(['jpeg', 'jpg', 'png']);
    const MIN_SIZE = 1024; // 1KB

    // Verificação básica de tamanho
    if (file.size < MIN_SIZE) {
      throw new BadRequestException(ErrorsEnum.FILE_SMALL);
    }

    // Detecta extensão usando magic-bytes.js
    const [detectedType] = filetypeextension(file.buffer);
    if (!detectedType || !ALLOWED_MIME_TYPES.has(detectedType)) {
      throw new BadRequestException(ErrorsEnum.INVALID_FILE_TYPE);
    }

    // Gera o nome do arquivo baseado no ID do usuário
    const fileName = `${file.originalname.split('.')[0]}-${tokenPayload.sub}.${detectedType}`;
    const fileRef = bucket.file(fileName);

    // Verifica se já existe arquivo com o mesmo nome
    const [exists] = await fileRef.exists();
    if (exists) {
      throw new ConflictException(ErrorsEnum.FILE_ALREADY_EXISTS);
    }

    // Processa imagem para obter metadados (com segurança)
    let metadata: sharp.Metadata;
    try {
      metadata = await sharp(file.buffer).metadata();
    } catch (error: unknown) {
      throw new BadRequestException(ErrorsEnum.INVALID_FILE_TYPE);
    }

    // Faz upload para o bucket
    try {
      await fileRef.save(file.buffer);
    } catch (err) {
      console.error('Upload error:', err);
      throw new Error(ErrorsEnum.UPLOAD_FILES_FAILED);
    }

    return this.update(
      tokenPayload.sub,
      {
        profileImage: {
          src: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
          alt: fileName,
          width: metadata.width ?? 0,
          height: metadata.height ?? 0,
        },
      },
      tokenPayload,
    );
  }
}
