import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorExecptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const reponse = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const statusCode: number = exception.getStatus
      ? exception.getStatus()
      : 400;

    // Works only with BadRequestException error
    const exceptionResponse = exception.getResponse
      ? exception.getResponse()
      : { message: 'Error', statusCode };

    reponse.status(statusCode).json({
      ...(typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse),
      data: new Date().toISOString(),
      path: request.url,
    });
  }
}
