import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    
    if (status === 400) {
      let errorResponse = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();
      
      responseBody.message.forEach((m, i) => {
        if (
          i > 0 &&
          responseBody.message[i].slice(
            0,
            responseBody.message[i].indexOf(' '),
          ) ===
            responseBody.message[i - 1].slice(
              0,
              responseBody.message[i - 1].indexOf(' '),
            )
        )
          return;
          const mArr = m.split(' ')
        errorResponse.errorsMessages.push({
          message: m,
          field: mArr[0] === 'each' ? mArr[3] : mArr[0],
        });
      });


      response.status(status).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    //const isHttpException = exception instanceof HttpException
    //const exceptionResponse = isHttpException ? exception.getResponse() : null

    //const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // response.status(status).json({
    //    statusCode: status,
    //    timestamp: new Date().toISOString(),
    //    message: exception?.message || '',
    //    errorDescription: exceptionResponse || null
    // });
  }
}
