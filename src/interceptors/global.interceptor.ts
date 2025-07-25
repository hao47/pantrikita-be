import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import * as multer from 'multer';

@Injectable()
export class GlobalFileInterceptor implements NestInterceptor {
  private multerUpload = multer().single('file'); // Replace 'file' with the actual field name for file upload

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();


    // gara gara ini image file nya ngga bisa
    if (request.url.includes('/scan/identify')) {
      return next.handle();
    }

    // Manually apply the file handling logic
    return new Observable((observer) => {
      this.multerUpload(request, response, (err) => {
        if (err) {
          observer.error(err); // Propagate error if any
        } else {
          next.handle().subscribe(observer); // Proceed with the request if no error
        }
      });
    });
  }
}
