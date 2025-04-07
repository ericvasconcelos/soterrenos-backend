import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token || token !== 'mytoken') {
      throw new UnauthorizedException('USER_NOT_AUTHORIZED');
    }

    return next.handle();
  }
}
