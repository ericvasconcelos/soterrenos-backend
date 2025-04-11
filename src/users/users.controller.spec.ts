import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { UserTypeEnum } from './dto/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserFactory } from './factories/user.factory';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const usersServiceMock = {
    create: jest.fn(),
    findAllByType: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadPicture: jest.fn(),
  } as unknown as UsersService;

  const createUser = UserFactory.create(UserTypeEnum.OWNER)

  beforeEach(() => {
    controller = new UsersController(usersServiceMock);
  });

  it('create', async () => {
    const expected = {
      ...createUser,
      id: '1'
    }
    jest.spyOn(usersServiceMock, 'create').mockResolvedValue(expected);
    const result = await controller.create(createUser);
    expect(usersServiceMock.create).toHaveBeenCalledWith(createUser);
    expect(result).toEqual(expect.objectContaining({
      email: expected.email,
      phoneNumber: expected.phoneNumber,
      whatsappNumber: expected.whatsappNumber,
      profileImage: expected.profileImage,
      type: expected.type,
      personalFirstName: expected.personalFirstName,
      personalLastName: expected.personalLastName,
      personalId: expected.personalId,
      id: expected.id,
    }));
  });


  it('findAllByType', async () => {
    const expected = {
      data: [{ ...createUser, id: '1', activeLandsCount: 1 }],
      count: 1,
      currentPage: 1,
      lastPage: 1,
      nextPage: null,
      prevPage: null,
    };
    jest.spyOn(usersServiceMock, 'findAllByType').mockResolvedValue(expected);
    const result = await controller.findAllByType({ type: UserTypeEnum.OWNER });
    expect(usersServiceMock.create).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({
      count: 1,
      currentPage: 1,
      lastPage: 1,
      nextPage: null,
      prevPage: null,
      data: [expect.objectContaining({
        email: createUser.email,
        phoneNumber: createUser.phoneNumber,
        whatsappNumber: createUser.whatsappNumber,
        profileImage: createUser.profileImage,
        type: createUser.type,
        personalFirstName: createUser.personalFirstName,
        personalLastName: createUser.personalLastName,
        personalId: createUser.personalId,
        id: '1',
      })]
    }));
  });

  it('findOne', async () => {
    const id = '1';
    const tokenPayload = { sub: id } as TokenPayloadDto;
    const expected = { ...createUser, id: '1' };
    jest.spyOn(usersServiceMock, 'findOne').mockResolvedValue(expected);
    const result = await controller.findOne(id, tokenPayload);
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(id, tokenPayload);
    expect(result).toEqual(expect.objectContaining({
      email: expected.email,
      phoneNumber: expected.phoneNumber,
      whatsappNumber: expected.whatsappNumber,
      profileImage: expected.profileImage,
      type: expected.type,
      personalFirstName: expected.personalFirstName,
      personalLastName: expected.personalLastName,
      personalId: expected.personalId,
      id: expected.id,
    }));
  });

  it('update', async () => {
    const id = '1';
    const userDto = { personalFirstName: 'new value' } as UpdateUserDto;
    const tokenPayload = { sub: 'value' } as TokenPayloadDto;
    const expected = { ...createUser, id: '1' };
    jest.spyOn(usersServiceMock, 'update').mockResolvedValue({
      ...expected,
      ...userDto,
    });
    const result = await controller.update(id, userDto, tokenPayload);
    expect(usersServiceMock.update).toHaveBeenCalledWith(id, userDto, tokenPayload);
    expect(result).toEqual(expect.objectContaining({
      email: expected.email,
      phoneNumber: expected.phoneNumber,
      whatsappNumber: expected.whatsappNumber,
      profileImage: expected.profileImage,
      type: expected.type,
      personalFirstName: expected.personalFirstName,
      personalLastName: expected.personalLastName,
      personalId: expected.personalId,
      id: expected.id,
      ...userDto,
    }));
  });

  it('remove', async () => {
    const id = '1';
    const tokenPayload = { sub: id } as TokenPayloadDto;
    const expected = { message: 'USER_DELETED' };

    jest.spyOn(usersServiceMock, 'remove').mockResolvedValue(expected);

    const result = await controller.remove(id, tokenPayload);
    expect(usersServiceMock.remove).toHaveBeenCalledWith(id, tokenPayload);
    expect(result).toEqual(expected);
  });

  it('uploadPicture', async () => {
    const mockFile = {
      originalname: 'test.png',
      mimetype: 'sample.type',
      path: 'sample.url',
      size: 2000,
      buffer: Buffer.from('file content'),
    };
    const tokenPayload = { sub: 'value' } as TokenPayloadDto;
    const expected = { personalFirstName: 'anyValue' } as User;

    jest.spyOn(usersServiceMock, 'uploadPicture').mockResolvedValue(expected);

    const result = await controller.uploadPicture(mockFile as Express.Multer.File, tokenPayload);

    expect(usersServiceMock.uploadPicture).toHaveBeenCalledWith(mockFile, tokenPayload);
    expect(result).toEqual(expected);
  });
});