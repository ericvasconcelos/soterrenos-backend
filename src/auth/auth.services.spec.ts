import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HashingService } from "src/auth/hashing/hashing.service";
import { ErrorsEnum } from "src/common/constants/errors.constants";
import { User } from 'src/users/entities/user.entity';
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import jwtConfig from "./config/jwt.config";

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let hashingService: HashingService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    type: 'owner',
    role: 'user'
  };

  const loginDto = {
    email: 'test@example.com',
    password: 'validPassword'
  };

  const tokens = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken'
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: HashingService,
          useValue: {
            compare: jest.fn().mockResolvedValue(true),
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            verifyAsync: jest.fn(),
          }
        },
        {
          provide: jwtConfig.KEY,
          useValue: {
            secret: 'secret',
            audience: 'audience',
            issuer: 'issuer',
            jwtTtl: 3600,
            jwtRefreshTtl: 86400
          }
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService);
    hashingService = module.get<HashingService>(HashingService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('check modules', () => {
    expect(authService).toBeDefined()
    expect(hashingService).toBeDefined();
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      jest.spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);

      const result = await authService.login(loginDto);

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email
      });
      expect(hashingService.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password
      );
      expect(result).toEqual(tokens);
    });


    it('should throw error for invalid email', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(ErrorsEnum.USER_NOT_FOUND)
      );
    });

    it('should throw error for invalid password', async () => {
      jest.spyOn(hashingService, 'compare').mockResolvedValueOnce(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(ErrorsEnum.INVALID_PASSWORD)
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens for valid refresh token', async () => {
      const refreshTokenDto = { refreshToken: 'validRefreshToken' };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: mockUser.id });
      jest.spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);

      const result = await authService.refreshToken(refreshTokenDto);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
        expect.any(Object)
      );
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: mockUser.id });
      expect(result).toEqual(tokens);
    });

    it('should throw error for invalid refresh token', async () => {
      const refreshTokenDto = { refreshToken: 'invalidRefreshToken' };

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

      await expect(authService.refreshToken(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw error for invalid user', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 'non-user' });
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(ErrorsEnum.USER_NOT_FOUND)
      );
    });
  });
});