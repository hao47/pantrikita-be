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
import { HomeService } from './home.service';

import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('home')
export class HomeController {
    constructor(private homeService: HomeService) {}



    @Get()
    findAll(@Request() request: any, ): Promise<any>  {
        const userId: string = request.user.sub.id;

        return this.homeService.findAll(userId);
    }



}
