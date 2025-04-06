import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const lands = await this.landsRepository.find({
      take: limit,
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

  async create(createLandDto: CreateLandDto) {
    const slug = await this.generateUniqueSlug(createLandDto.title);
    const user = await this.usersRepository.findOne({
      where: {
        id: createLandDto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

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

  async update(id: string, updateLandDto: UpdateLandDto) {
    const land = await this.findOne(id);

    if (!land) return this.throwNotFoundError();

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

  async remove(id: string) {
    const land = await this.landsRepository.findOneBy({ id });
    if (!land) return this.throwNotFoundError();
    return this.landsRepository.remove(land);
  }
}
