import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ExceptionCodeName } from '../enum/exception-codes.enum';
import { QueryFailedError } from 'typeorm';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let err: { name: string; stack?: string; message: string };

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      response.body = exception.getResponse();
      err = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      };
    } else if (exception instanceof QueryFailedError) {
      const e = new InternalServerErrorException(
        ExceptionCodeName.QUERY_FAILED_ERROR,
      );
      response.status(e.getStatus()).json(e.getResponse());
      response.body = e.getResponse();
      err = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      };
    } else {
      console.log(exception);
      const e = new InternalServerErrorException(
        ExceptionCodeName.UNKNOWN_ERROR,
      );
      response.status(e.getStatus()).json(e.getResponse());
      response.body = e.getResponse();
      err = {
        name: 'Uknown Exception',
        message: 'UNKNOWN_ERROR',
        stack: JSON.stringify(exception),
      };
    }

    this.logger.log({
      level: 'error',
      message: `${request.method} - ${request.url}`,
      name: `${request.method} - ${request.url}`,
      err,
      request,
      response,
    });
  }
}
