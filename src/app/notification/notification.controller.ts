import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    UseGuards,
    Request,
    Patch,
    Put, Res, Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}



    @Get()
    findAll(@Request() request: any, ): Promise<any>  {
        const userId: string = request.user.sub.id;

        return this.notificationService.findAll(userId);
    }



}
