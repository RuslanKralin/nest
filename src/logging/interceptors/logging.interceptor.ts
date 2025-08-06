// src/logging/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggingService } from '../logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    // Проверяем, есть ли у нас доступ к пользователю
    const user = request.user;

    // Информация о запросе для логирования
    const requestInfo = {
      method,
      url,
      body: { ...body, password: body?.password ? '[СКРЫТО]' : undefined },
      timestamp: now,
    };

    if (user && user.id) {
      // Если есть информация о пользователе
      this.loggingService.info(
        `Запрос: ${method} ${url}`,
        'HTTPRequest',
        requestInfo,
        user.id,
        { email: user.email },
        'api_request',
      );
    } else {
      // Анонимный запрос
      this.loggingService.info(
        `Запрос: ${method} ${url}`,
        'HTTPRequest',
        requestInfo,
      );
    }

    return next.handle().pipe(
      tap((response) => {
        const responseTime = Date.now() - now;

        if (user && user.id) {
          this.loggingService.info(
            `Ответ: ${method} ${url} - ${responseTime}ms`,
            'HTTPResponse',
            { responseTime, status: 'success' },
            user.id,
            { email: user.email },
            'api_response',
          );
        } else {
          this.loggingService.info(
            `Ответ: ${method} ${url} - ${responseTime}ms`,
            'HTTPResponse',
            { responseTime, status: 'success' },
          );
        }
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;

        if (user && user.id) {
          this.loggingService.error(
            `Ошибка: ${method} ${url} - ${error.message}`,
            'HTTPError',
            error.stack,
            { responseTime, status: error.status },
            user.id,
            { email: user.email },
            'api_error',
          );
        } else {
          this.loggingService.error(
            `Ошибка: ${method} ${url} - ${error.message}`,
            'HTTPError',
            error.stack,
            { responseTime, status: error.status },
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
