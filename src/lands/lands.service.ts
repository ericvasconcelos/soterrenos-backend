import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { Land } from './entities/land.entity';

@Injectable()
export class LandsService {
  constructor(
    @InjectRepository(Land)
    private readonly landsRepository: Repository<Land>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  throwNotFoundError() {
    throw new NotFoundException('LAND_NOT_FOUND');
  }

  private createSlug(title: string): string {
    let slug = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    slug = slug
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');

    return slug.substring(0, 100);
  }

  private async generateUniqueSlug(
    title: string,
    existingId?: string,
  ): Promise<string> {
    const baseSlug = this.createSlug(title);
    let candidate = baseSlug;
    let counter = 1;

    do {
      const existing = await this.landsRepository.findOne({
        where: { slug: candidate },
        select: ['id'],
      });

      if (!existing || (existingId && existing.id === existingId)) {
        return candidate;
      }

      candidate = `${baseSlug}-${counter++}`;
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  async findAll(paginationDto?: PaginationDto) {
    const page = paginationDto?.page ?? 1;
    const size = paginationDto?.size ?? 10;
    const offset = (page - 1) * size;

    const lands = await this.landsRepository.find({
      take: size,
      skip: offset,
      order: {
        id: 'desc',
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
          personalFirstName: true,
          personalLastName: true,
          tradeName: true,
        },
      },
    });
    return lands;
  }

  async findOne(id: string) {
    const land = await this.landsRepository.findOne({
      where: { id },
      relations: ['user'],
      order: {
        id: 'desc',
      },
      select: {
        user: {
          id: true,
          personalFirstName: true,
          personalLastName: true,
          tradeName: true,
        },
      },
    });

    if (!land) this.throwNotFoundError();
    return land;
  }

  async create(createLandDto: CreateLandDto, tokenPayload: TokenPayloadDto) {
    const slug = await this.generateUniqueSlug(createLandDto.title);
    const user = await this.usersRepository.findOneBy({ id: tokenPayload?.sub });

    if (!user || !user?.id) throw new NotFoundException('USER_NOT_FOUND');

    const land = this.landsRepository.create({
      ...createLandDto,
      slug,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.landsRepository.save(land);

    return {
      ...land,
      user: land.user.id,
    };
  }

  async update(id: string, updateLandDto: UpdateLandDto, tokenPayload: TokenPayloadDto) {
    const land = await this.findOne(id);
    const user = await this.usersRepository.findOneBy({ id: tokenPayload?.sub })

    if (!land) return this.throwNotFoundError();
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    if (user?.id !== land?.user?.id) throw new ForbiddenException('DONT_HAVE_PERMISSION');

    if (updateLandDto?.title && land?.title !== updateLandDto.title) {
      land.slug = await this.generateUniqueSlug(updateLandDto.title, id);
    }

    const newLand: Partial<Land> = {
      ...land,
      ...updateLandDto,
      updatedAt: new Date(),
    };

    await this.landsRepository.save(newLand);
    return newLand;
  }

  async remove(id: string, tokenPayload: TokenPayloadDto) {
    const land = await this.findOne(id);
    const user = await this.usersRepository.findOneBy({ id: tokenPayload?.sub })

    if (!land) return this.throwNotFoundError();
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    if (user?.id !== land?.user?.id) throw new ForbiddenException('DONT_HAVE_PERMISSION');

    await this.landsRepository.remove(land);

    return {
      message: 'LAND_DELETED'
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExtension = path
          .extname(file.originalname as string)
          .toLowerCase()
          .substring(1);

        const fileName = `${randomUUID()}.${fileExtension}`;
        const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

        // Escreve o arquivo e retorna o caminho completo
        await fs.writeFile(fileFullPath, file.buffer as Buffer);
        return { src: `/pictures/${fileName}` }
      });

      const result = await Promise.all(uploadPromises);
      return result;
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException('UPLOAD_FILES_FAILED');
    }
  }
}
