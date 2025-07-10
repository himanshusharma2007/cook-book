// common/interceptors/response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    const message = res.locals.message || 'Request successful';
    const key = res.locals.key || 'data';

    return next.handle().pipe(
      map((data) => {
        // If already wrapped
        if (data && typeof data === 'object' && 'success' in data) return data;

        return {
          success: true,
          [key]: data, // 👈 dynamic key like 'user', 'recipe'
          message,
        };
      }),
    );
  }
}
