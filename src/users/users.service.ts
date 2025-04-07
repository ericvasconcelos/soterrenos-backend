import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService
  ) { }

  throwNotFoundError() {
    throw new NotFoundException('USER_NOT_FOUND');
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return this.throwNotFoundError();
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

    if (!user) return this.throwNotFoundError();
    if (user.id !== tokenPayload?.sub) throw new ForbiddenException('DONT_HAVE_PERMISSION')

    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: string, tokenPayload: TokenPayloadDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return this.throwNotFoundError();
    if (id !== tokenPayload?.sub) throw new ForbiddenException('DONT_HAVE_PERMISSION')
    await this.usersRepository.remove(user);
  }
}
