import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { mergeMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async intercept<T extends Record<string, unknown>>(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<string | T | T[]>> {
    const now = Date.now();

    return next
      .handle()
      .pipe(
        mergeMap(async value => await this.RecursivelySetResponse<T>(value)),
      )
      .pipe(
        tap(value => {
          const request = context.switchToHttp().getRequest();
          const response = context.switchToHttp().getResponse();
          response.responseTime = Date.now() - now;
          response.body = value;
          this.logger.log({
            level: 'info',
            message: `${request.method} - ${request.url}`,
            name: `${request.method} - ${request.url}`,
            request,
            response,
          });
        }),
      );
  }

  async RecursivelySetResponse<T extends Record<string, unknown> | string>(
    value: T,
  ): Promise<string | T[] | T> {
    if (Array.isArray(value)) {
      return await Promise.all(
        value.map(async element => await this.RecursivelySetResponse(element)),
      );
    } else if (typeof value === 'object' && value != null) {
      await Promise.all(
        Object.keys(value).map(async key => {
          value[key] = await this.RecursivelySetResponse(value[key]);
        }),
      );
      return value;
    } else {
      return value;
    }
  }
}
