import { validate } from 'class-validator';
import 'reflect-metadata';
import { UserFactory } from './../factories/user.factory';
import { CreateUserDto } from './create-user.dto';
import { UserTypeEnum } from './types';

describe('CreateUserDto', () => {
  it('should be a valid owner user', async () => {
    const dto = new CreateUserDto();
    const user = UserFactory.create(UserTypeEnum.OWNER)
    dto.type = user.type;
    dto.email = user.email;
    dto.personalFirstName = user.personalFirstName;
    dto.personalLastName = user.personalLastName;
    dto.personalId = user.personalId;
    dto.phoneNumber = user.phoneNumber;
    dto.whatsappNumber = user.whatsappNumber;
    dto.password = user.password;
    dto.profileImage = {
      src: '/pictures/image.png',
      width: 300,
      height: 300,
      alt: 'Image Picture'
    }

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be a valid salesperson user', async () => {
    const dto = new CreateUserDto();
    const user = UserFactory.create(UserTypeEnum.SALESPERSON)
    dto.type = user.type;
    dto.email = user.email;
    dto.personalFirstName = user.personalFirstName;
    dto.personalLastName = user.personalLastName;
    dto.personalId = user.personalId;
    dto.phoneNumber = user.phoneNumber;
    dto.whatsappNumber = user.whatsappNumber;
    dto.password = user.password;
    dto.creci = user.creci;
    dto.creciState = user.creciState;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be a valid agency user', async () => {
    const dto = new CreateUserDto();
    const user = UserFactory.create(UserTypeEnum.AGENCY)
    dto.type = user.type;
    dto.email = user.email;
    dto.legalName = user.legalName;
    dto.tradeName = user.tradeName;
    dto.companyId = user.companyId;
    dto.phoneNumber = user.phoneNumber;
    dto.whatsappNumber = user.whatsappNumber;
    dto.password = user.password;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });


  it('deve falhar se o email for inválido', async () => {
    const dto = new CreateUserDto();
    dto.type = UserTypeEnum.OWNER;
    dto.email = 'teste@gm';
    dto.personalFirstName = '1';
    dto.personalLastName = '2';
    dto.personalId = '111.111.111-55';
    dto.phoneNumber = '612345123';
    dto.whatsappNumber = '612345123';
    dto.password = '123456';

    const findError = (property: string): boolean => {
      const error = errors.find((error) => error.property === property);
      return !!error;
    }

    const errors = await validate(dto);
    expect(errors.length).toBe(7);
    expect(findError('email')).toBe(true);
    expect(findError('personalFirstName')).toBe(true);
    expect(findError('personalLastName')).toBe(true);
    expect(findError('personalId')).toBe(true);
    expect(findError('phoneNumber')).toBe(true);
    expect(findError('whatsappNumber')).toBe(true);
    expect(findError('password')).toBe(true);
  });
});