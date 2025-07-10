import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

interface StandardResponse<T> {
  success: boolean;
  message: string;
  [key: string]: T | boolean | string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const message: string = (res.locals?.message as string) || 'Request successful';
    const key: string = (res.locals?.key as string) || 'data';

    return next.handle().pipe(
      map((data: T) => {
        if (data && typeof data === 'object' && 'success' in data)
          return data as StandardResponse<T>;

        return {
          success: true,
          [key]: data,
          message,
        };
      })
    );
  }
}
