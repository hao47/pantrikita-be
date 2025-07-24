import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException, HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status =
            exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;


        console.error(exception)
        const message =
            exception instanceof HttpException ? exception.message : request.url;
        console.error(exception);

        if (status != HttpStatus.INTERNAL_SERVER_ERROR) {
            response.status(status).json({
                status: "error",
                message: exception instanceof HttpException ? exception.getResponse()["message"] : request.url,
            });
        } else {
            response.status(status).json({
                status: "error",
                message: message,
            });
        }

        if (!(exception instanceof HttpException)) {
            console.error("Non-HTTP Exception:", exception);
        }
    }
}
