import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../constants.auth";
import { TokenPayloadDto } from "../dto/token-payload.dto";

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) throw new UnauthorizedException('UNAUTHORIZED')

    try {

      const payload: TokenPayloadDto = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;

    } catch (error) {
      throw new UnauthorizedException(error.message)
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];

    if (!token || typeof token !== 'string') {
      return;
    }

    return type === 'Bearer' ? token : undefined;
  }
}