import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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
    // const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      const userData = {
        ...createUserDto,
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
      isConfirmed: updateUserDto?.isConfirmed ?? false,
      updatedAt: new Date(),
    });

    if (!user) return this.throwNotFoundError();
    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) return this.throwNotFoundError();
    await this.usersRepository.remove(user);
  }
}
