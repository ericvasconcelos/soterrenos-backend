import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { ErrorsEnum } from 'src/common/constants/errors.constants';
import { LandSizeDto } from 'src/common/dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateLandDto } from './dto/create-land.dto';
import { QueryLandDto } from './dto/query-land.dto';
import { QueryUserLandsDto } from './dto/query-user-land.dto';
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

  private getTotalArea(landSize: LandSizeDto): number {
    const { front, left, right, back } = landSize
    const averageFrontBack = (front + back) / 2;
    const averageLeftRight = (left + right) / 2;
    const totalArea = averageFrontBack * averageLeftRight;
    return totalArea
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
      order: { id: 'desc' },
      relations: ['user'],
      select: {
        user: {
          id: true,
          type: true,
          personalFirstName: true,
          personalLastName: true,
          tradeName: true,
          phoneNumber: true,
          whatsappNumber: true,
          email: true,
          creci: true,
          profileImage: {
            src: true,
            width: true,
            height: true,
            alt: true,
          },
        },
      },
    });

    if (!land) throw new NotFoundException(ErrorsEnum.LAND_NOT_FOUND);
    return land;
  }

  async create(createLandDto: CreateLandDto, tokenPayload: TokenPayloadDto) {
    const slug = await this.generateUniqueSlug(createLandDto.title);
    const user = await this.usersRepository.findOneBy({ id: tokenPayload?.sub });

    if (!user || !user?.id) throw new NotFoundException(ErrorsEnum.USER_NOT_FOUND);

    const land = this.landsRepository.create({
      ...createLandDto,
      area: this.getTotalArea(createLandDto.landSize),
      slug,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.landsRepository.save(land);

    return {
      ...land,
      user: { id: land.user.id },
    };
  }

  async update(id: string, updateLandDto: UpdateLandDto, tokenPayload: TokenPayloadDto) {
    const land = await this.findOne(id);
    const user = await this.usersRepository.findOneBy({ id: tokenPayload?.sub })

    if (!land) throw new NotFoundException(ErrorsEnum.LAND_NOT_FOUND);
    if (!user) throw new NotFoundException(ErrorsEnum.USER_NOT_FOUND);
    if (user?.id !== land?.user?.id) throw new ForbiddenException(ErrorsEnum.DONT_HAVE_PERMISSION);

    if (updateLandDto?.title && land?.title !== updateLandDto.title) {
      land.slug = await this.generateUniqueSlug(updateLandDto.title, id);
    }

    if (updateLandDto?.landSize) {
      land.area = this.getTotalArea(updateLandDto.landSize);
    }

    const newLand = {
      ...land,
      ...updateLandDto,
      updatedAt: new Date(),
    };

    await this.landsRepository.save(newLand);
    return newLand;
  }

  async remove(id: string, tokenPayload: TokenPayloadDto) {
    const land = await this.findOne(id);
    if (!land) throw new NotFoundException(ErrorsEnum.LAND_NOT_FOUND);

    const user = await this.usersRepository.findOneBy({ id: tokenPayload?.sub })
    if (!user) throw new NotFoundException(ErrorsEnum.USER_NOT_FOUND);
    if (user?.id !== land?.user?.id) throw new ForbiddenException(ErrorsEnum.DONT_HAVE_PERMISSION);

    await this.landsRepository.remove(land);

    return {
      message: 'LAND_DELETED'
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExtension = path
          .extname(file.originalname)
          .toLowerCase()
          .substring(1);

        const fileName = `${randomUUID()}.${fileExtension}`;
        const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

        await fs.writeFile(fileFullPath, file.buffer);
        return { src: `/pictures/${fileName}` }
      });

      const result = await Promise.all(uploadPromises);
      return result;
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException(ErrorsEnum.UPLOAD_FILES_FAILED);
    }
  }

  async findLandsByUser(id: string, queryUserLands?: QueryUserLandsDto) {
    const active = queryUserLands?.active === 'true';
    const page = queryUserLands?.page ?? 1;
    const size = queryUserLands?.size ?? 10;
    const offset = (page - 1) * size;

    const [lands, total] = await this.landsRepository.findAndCount({
      where: {
        active,
        user: { id }
      },
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

    const lastPage = Math.ceil(total / size);

    return {
      data: lands,
      count: total,
      currentPage: page,
      lastPage,
      nextPage: page + 1 > lastPage ? null : page + 1,
      prevPage: page - 1 < 1 ? null : page - 1,
    };
  }

  async searchLands(state: string, city: string, queryLandDto?: QueryLandDto) {
    const page = queryLandDto?.page ?? 1;
    const size = queryLandDto?.size ?? 20;
    const offset = (page - 1) * size;

    const queryBuilder = this.landsRepository.createQueryBuilder('land')
      .where("land.address->>'state' = :state", { state })
      .andWhere("land.address->>'city' = :city", { city });

    if (queryLandDto?.minPrice || queryLandDto?.maxPrice) {
      queryBuilder.andWhere('land.price BETWEEN COALESCE(:minPrice, land.price) AND COALESCE(:maxPrice, land.price)', {
        minPrice: queryLandDto?.minPrice,
        maxPrice: queryLandDto?.maxPrice
      });
    }

    if (queryLandDto?.minArea || queryLandDto?.maxArea) {
      queryBuilder.andWhere('land.area BETWEEN COALESCE(:minArea, land.area) AND COALESCE(:maxArea, land.area)', {
        minArea: queryLandDto?.minArea,
        maxArea: queryLandDto?.maxArea
      });
    }

    const booleanFilters = [
      'fgts', 'financingAvailable', 'hasWater', 'hasArtesianWell',
      'hasSewageSystem', 'hasEletricity', 'isFenced',
      'isLandLeveled', 'isLotClear', 'established',
      'paved', 'streetLighting', 'sanitationBasic',
      'sidewalks', 'gatedEntrance', 'security'
    ];

    booleanFilters.forEach(filter => {
      if (queryLandDto?.[filter]) {
        queryBuilder.andWhere(`land.${filter} = :${filter}`, {
          [filter]: queryLandDto?.[filter] === 'true'
        });
      }
    });

    const selectFilters = ['soilType', 'slope', 'zoning', 'sunPosition'] as const;
    type SelectFilter = typeof selectFilters[number];
    selectFilters.forEach((filter: SelectFilter) => {
      if (queryLandDto?.[filter]) {
        queryBuilder.andWhere(`land.${filter} = :${filter}`, {
          [filter]: queryLandDto?.[filter]
        });
      }
    });

    if (queryLandDto?.commonAreas) {
      const areas = queryLandDto?.commonAreas.split(',');
      queryBuilder.andWhere('land.commonAreas @> :areas', { areas });
    }

    const [lands, total] = await queryBuilder
      .skip(offset)
      .take(size)
      .orderBy('land.id', 'DESC')
      .getManyAndCount();

    const lastPage = Math.ceil(total / size);

    return {
      data: lands,
      count: total,
      currentPage: page,
      lastPage,
      nextPage: page + 1 > lastPage ? null : page + 1,
      prevPage: page - 1 < 1 ? null : page - 1,
    };
  }
}
