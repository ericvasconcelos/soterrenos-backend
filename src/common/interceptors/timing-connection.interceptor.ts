import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const startTime = Date.now();
    console.log('Start: Timing Connection', startTime);
    await new Promise(resolve => setTimeout(resolve, 0));

    return next.handle().pipe(
      tap(() => {
        console.log('End: Timing Connection', Date.now() - startTime);
      }),
    );
  }
}
