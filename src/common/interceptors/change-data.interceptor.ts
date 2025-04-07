import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { LandResponseDto } from 'src/lands/dto/land-response.dto';

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: LandResponseDto) => {
        if (Array.isArray(data)) {
          return {
            data,
            count: data.length,
          };
        }

        return data;
      }),
    );
  }
}
