import { faker } from "@faker-js/faker/.";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as fs from 'fs/promises';
import * as magicBytes from 'magic-bytes.js';
import * as path from 'path';
import { TokenPayloadDto } from "src/auth/dto/token-payload.dto";
import { HashingService } from "src/auth/hashing/hashing.service";
import { Land } from "src/lands/entities/land.entity";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserTypeEnum } from "./dto/types";
import { UserResponseDto } from "./dto/user-response.dto";
import { User } from "./entities/user.entity";
import { UserFactory } from "./factories/user.factory";
import { UsersService } from "./users.service";

jest.mock('fs/promises');
jest.mock('magic-bytes.js');

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let hashingService: HashingService;
  const mockDate = new Date();
  const mockUpdateDate = new Date();
  const mockId = faker.string.uuid();
  const mockId2 = faker.string.uuid();
  const PASSWORD_HASH = 'hashedPassword'
  const tokenPayload = { sub: mockId } as TokenPayloadDto

  const initialUserOne: CreateUserDto = UserFactory.create(UserTypeEnum.OWNER)
  const initialUserTwo: CreateUserDto = UserFactory.create(UserTypeEnum.OWNER)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockImplementation((dto: User) => ({
              ...dto,
              id: mockId,
              createdAt: mockDate,
              updatedAt: mockDate,
            })),
            save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
            findOneBy: jest.fn().mockImplementation(() => Promise.resolve({
              ...initialUserOne,
              id: mockId,
              createdAt: mockDate,
              updatedAt: mockDate,
            })),
            findAndCount: jest.fn().mockImplementation(() => Promise.resolve([[
              {
                ...initialUserOne,
                id: mockId,
                createdAt: mockDate,
                updatedAt: mockDate,
              },
              {
                ...initialUserTwo,
                id: mockId2,
                createdAt: mockDate,
                updatedAt: mockDate,
              }
            ], 2])),
            preload: jest.fn().mockImplementation((updateUser) => Promise.resolve({
              ...initialUserOne,
              ...updateUser,
              createdAt: mockDate,
              updatedAt: mockUpdateDate,
            })),
            remove: jest.fn()
          },
        },
        {
          provide: getRepositoryToken(Land),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue([{ userId: mockId, count: '1' }]),
            }),
          }
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn().mockResolvedValue(PASSWORD_HASH),
          }
        },
        {
          provide: MailService,
          useValue: {
            sendActivationEmail: jest.fn()
          }
        }
      ]
    }).compile()

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('check UsersService', () => {
    expect(usersService).not.toBeUndefined()
  });

  describe('create', () => {
    it('should create owner user type', async () => {
      const result = await usersService.create(initialUserOne);

      expect(hashingService.hash).toHaveBeenCalledWith(initialUserOne.password)

      expect(usersRepository.create).toHaveBeenCalledWith({
        ...initialUserOne,
        password: PASSWORD_HASH,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      })

      expect(usersRepository.save).toHaveBeenCalled();

      expect(result).toEqual(expect.objectContaining({
        ...initialUserOne,
        password: PASSWORD_HASH,
        id: mockId,
        createdAt: mockDate,
        updatedAt: mockDate
      }));
    });

    it('should create salesperson user type', async () => {
      const salesperson = UserFactory.create(UserTypeEnum.SALESPERSON)
      const result = await usersService.create(salesperson);

      expect(hashingService.hash).toHaveBeenCalledWith(salesperson.password)

      expect(usersRepository.create).toHaveBeenCalledWith({
        ...salesperson,
        password: PASSWORD_HASH,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      })

      expect(usersRepository.save).toHaveBeenCalled();

      expect(result).toEqual(expect.objectContaining({
        ...salesperson,
        password: PASSWORD_HASH,
        id: mockId,
        createdAt: mockDate,
        updatedAt: mockDate
      }));
    });

    it('should create agency user type', async () => {
      const agency = UserFactory.create(UserTypeEnum.AGENCY)
      const result = await usersService.create(agency);

      expect(hashingService.hash).toHaveBeenCalledWith(agency.password)

      expect(usersRepository.create).toHaveBeenCalledWith({
        ...agency,
        password: PASSWORD_HASH,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      })

      expect(usersRepository.save).toHaveBeenCalled();

      expect(result).toEqual(expect.objectContaining({
        ...agency,
        password: PASSWORD_HASH,
        id: mockId,
        createdAt: mockDate,
        updatedAt: mockDate
      }));
    });

    it('should throw ConflictException on duplicate email', async () => {
      jest.spyOn(usersRepository, 'save').mockRejectedValue({
        code: '23505'
      });

      await expect(usersService.create(initialUserOne)).rejects.toThrow(ConflictException);
      await expect(usersService.create(initialUserOne)).rejects.toThrow('EMAIL_ALREADY_REGISTERED');
    });

    it('should throw other errors', async () => {
      const error = new Error('Database error');
      jest.spyOn(usersRepository, 'save').mockRejectedValueOnce(error);
      await expect(usersService.create(initialUserOne)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    const foundUser: UserResponseDto = {
      ...initialUserOne,
      id: mockId,
      createdAt: mockDate,
      updatedAt: mockDate,
      profileImage: undefined
    }

    it('should find user by ID', async () => {
      const result = await usersService.findOne(mockId, tokenPayload);

      expect(result).toEqual(expect.objectContaining({
        ...foundUser,
        id: mockId,
        createdAt: mockDate,
        updatedAt: mockDate
      }));
    });

    it('should throw other errors', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      await expect(usersService.findOne('1', tokenPayload)).rejects.toThrow(NotFoundException);
      await expect(usersService.findOne('1', tokenPayload)).rejects.toThrow('USER_NOT_FOUND');
    });
  });

  describe('findAllByType', () => {
    it('should return all users', async () => {
      const result = await usersService.findAllByType(UserTypeEnum.OWNER);
      expect(result.data).toEqual([
        expect.objectContaining({
          ...initialUserOne,
          id: mockId,
          createdAt: mockDate,
          updatedAt: mockDate,
          profileImage: undefined,
          activeLandsCount: 1
        }),
        expect.objectContaining({
          ...initialUserTwo,
          id: mockId2,
          createdAt: mockDate,
          updatedAt: mockDate,
          profileImage: undefined,
          activeLandsCount: 0
        })
      ]);
    });

    it('should return empty array', async () => {
      jest.spyOn(usersRepository, 'findAndCount').mockResolvedValue([[], 0])
      const result = await usersService.findAllByType(UserTypeEnum.OWNER);
      expect(result.data.length).toEqual(0);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateUser = { personalFirstName: 'Eric', password: 'newPassword' }
      const result = await usersService.update(mockId, updateUser, tokenPayload);

      expect(result).toEqual(
        expect.objectContaining({
          ...initialUserOne,
          id: mockId,
          password: PASSWORD_HASH,
          personalFirstName: updateUser.personalFirstName,
          createdAt: mockDate,
          updatedAt: mockUpdateDate,
          profileImage: undefined,
          isConfirmed: false,
        })
      );
    });

    it('should not found user', async () => {
      const updateUser = { personalFirstName: 'Eric' }

      jest.spyOn(usersRepository, 'preload').mockResolvedValue(undefined)

      await expect(usersService.update(mockId, updateUser, tokenPayload)).rejects.toThrow(NotFoundException)
      await expect(usersService.update(mockId, updateUser, tokenPayload)).rejects.toThrow('USER_NOT_FOUND')
    });


    it('should not update with invalid token', async () => {
      const updateUser = { personalFirstName: 'Eric' }
      const tokenPayload = { sub: '1234' } as TokenPayloadDto

      await expect(usersService.update(mockId, updateUser, tokenPayload)).rejects.toThrow(ForbiddenException)
      await expect(usersService.update(mockId, updateUser, tokenPayload)).rejects.toThrow('DONT_HAVE_PERMISSION')
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const tokenPayload = { sub: mockId } as TokenPayloadDto

      const result = await usersService.remove(mockId, tokenPayload);
      expect(result).toEqual({ message: 'USER_DELETED' });
    });

    it('should not found user', async () => {
      const tokenPayload = { sub: mockId } as TokenPayloadDto

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null)

      await expect(usersService.remove(mockId, tokenPayload)).rejects.toThrow(NotFoundException)
      await expect(usersService.remove(mockId, tokenPayload)).rejects.toThrow('USER_NOT_FOUND')
    });


    it('should not remove with invalid token', async () => {
      const currTokenPayload = { sub: '1234' } as TokenPayloadDto

      await expect(usersService.remove(mockId, currTokenPayload)).rejects.toThrow(ForbiddenException)
      await expect(usersService.remove(mockId, currTokenPayload)).rejects.toThrow('DONT_HAVE_PERMISSION')
    });
  });

  describe('uploadPicture', () => {
    it('should upload profile image of user', async () => {
      const tokenPayload = { sub: mockId } as TokenPayloadDto
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      }

      const fileFullPath = path.resolve(process.cwd(), 'pictures', `profile-${tokenPayload.sub}.png`);

      jest.spyOn(magicBytes, 'filetypeextension').mockReturnValue(['png'])

      jest.spyOn(usersService, 'update').mockResolvedValue({
        ...initialUserOne,
        id: mockId,
        profileImage: {
          src: fileFullPath
        },
      });


      const result = await usersService.uploadPicture(mockFile as Express.Multer.File, tokenPayload);
      expect(fs.writeFile).toHaveBeenCalledWith(fileFullPath, mockFile.buffer);
      expect(result).toEqual(expect.objectContaining({
        ...initialUserOne,
        id: mockId,
        profileImage: {
          src: fileFullPath
        },
      }));
    });


    it('should throw BadRequestException for small files', async () => {
      const tokenPayload = { sub: mockId } as TokenPayloadDto
      const mockFile = {
        originalname: 'test.png',
        size: 1023,
        buffer: Buffer.from('file content'),
      }

      await expect(usersService.uploadPicture(mockFile as Express.Multer.File, tokenPayload)).rejects.toThrow(BadRequestException);
      await expect(usersService.uploadPicture(mockFile as Express.Multer.File, tokenPayload)).rejects.toThrow('FILE_SMALL');
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const tokenPayload = { sub: mockId } as TokenPayloadDto
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      }

      jest.spyOn(magicBytes, 'filetypeextension').mockReturnValue(['webp'])
      await expect(usersService.uploadPicture(mockFile as Express.Multer.File, tokenPayload)).rejects.toThrow(BadRequestException);
      await expect(usersService.uploadPicture(mockFile as Express.Multer.File, tokenPayload)).rejects.toThrow('INVALID_FILE_TYPE');
    });
  });
});