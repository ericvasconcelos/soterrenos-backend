import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { filetypeextension } from 'magic-bytes.js';
import * as path from 'path';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Land } from 'src/lands/entities/land.entity';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserTypeEnum } from './dto/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  async findAllByType(type: UserTypeEnum, paginationDto?: PaginationDto) {
    const page = paginationDto?.page ?? 1;
    const size = paginationDto?.size ?? 10;
    const offset = (page - 1) * size;

    const [users, total] = await this.usersRepository.findAndCount({
      where: { type: type },
      order: { createdAt: 'DESC' },
      take: size,
      skip: offset,
    });

    const userIds = users.map((user) => user.id);

    const landsCounts = await this.landsRepository
      .createQueryBuilder('land')
      .select('land.userId', 'userId')
      .addSelect('COUNT(land.id)', 'count')
      .where('land.userId IN (:...userIds)', { userIds })
      .andWhere('land.active = :active', { active: true })
      .groupBy('land.userId')
      .getRawMany();

    const countsMap = new Map<string, number>(
      landsCounts.map((lc) => [lc.userId, parseInt(lc.count as string, 10)]),
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
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    return user;
  }

  async findOne(id: string, tokenPayload: TokenPayloadDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    if (user?.id !== tokenPayload?.sub) throw new ForbiddenException('DONT_HAVE_PERMISSION')
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashingService.hash(createUserDto.password);

    try {
      const userData = {
        ...createUserDto,
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
        throw new ConflictException('EMAIL_ALREADY_REGISTERED');
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

    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    if (user.id !== tokenPayload?.sub) throw new ForbiddenException('DONT_HAVE_PERMISSION')

    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: string, tokenPayload: TokenPayloadDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    if (id !== tokenPayload?.sub) throw new ForbiddenException('DONT_HAVE_PERMISSION')
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

    if (file.size < 1024) throw new BadRequestException('FILE_SMALL')

    const fileTypeExtension = filetypeextension(file.buffer)[0];
    if (!fileTypeExtension || !ALLOWED_MIME_TYPES.has(fileTypeExtension)) {
      throw new BadRequestException('INVALID_FILE_TYPE');
    }

    const fileName = `profile-${tokenPayload.sub}.${fileTypeExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    return await this.update(
      tokenPayload.sub,
      { profileImage: { src: `/pictures/${fileName}` } },
      tokenPayload
    )
  }
}
