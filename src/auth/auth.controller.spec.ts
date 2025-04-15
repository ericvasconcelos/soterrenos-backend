import { faker } from '@faker-js/faker/.';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    login: jest.fn(),
    refreshToken: jest.fn(),
  } as unknown as AuthService;

  beforeEach(() => {
    controller = new AuthController(authServiceMock);
  });

  it('login', async () => {
    const expected = {
      accessToken: faker.string.alphanumeric(20),
      refreshToken: faker.string.alphanumeric(20),
    }

    const loginData = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    jest.spyOn(authServiceMock, 'login').mockResolvedValue(expected);
    const result = await controller.login(loginData);
    expect(authServiceMock.login).toHaveBeenCalledWith(loginData);
    expect(result).toEqual(expected);
  });


  it('refreshToken', async () => {
    const expected = {
      accessToken: faker.string.alphanumeric(20),
      refreshToken: faker.string.alphanumeric(20),
    }

    const refreshData = {
      refreshToken: faker.string.alphanumeric(20),
    }

    jest.spyOn(authServiceMock, 'refreshToken').mockResolvedValue(expected);
    const result = await controller.refreshToken(refreshData);
    expect(authServiceMock.refreshToken).toHaveBeenCalledWith(refreshData);
    expect(result).toEqual(expected);
  });
});