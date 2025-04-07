import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from './config/jwt.config';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRespository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.usersRespository.findOneBy({
      email: loginDto.email
    })

    if (!user) throw new UnauthorizedException('USER_NOT_FOUND')

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.password
    )

    if (!passwordIsValid) throw new UnauthorizedException('INVALID_PASSWORD')

    return this.createToken(user)
  }

  private async createToken(user: User) {
    const accessTokenPromise = await this.signJwtAsync<Partial<User>>(
      user.id,
      this.jwtConfiguration.jwtTtl,
      { email: user.email }
    )

    const refreshTokenPromise = await this.signJwtAsync(
      user.id,
      this.jwtConfiguration.jwtRefreshTtl,
    )

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      accessToken,
      refreshToken
    }
  }

  private async signJwtAsync<T>(sub: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub }: TokenPayloadDto = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration
      )

      const user = await this.usersRespository.findOneBy({ id: sub })
      if (!user) throw new UnauthorizedException('USER_NOT_FOUND')

      return this.createToken(user);
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }
}
