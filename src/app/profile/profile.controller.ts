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
    Put, Res, Query, Delete,
} from '@nestjs/common';
import {ProfileService} from './profile.service';

import {AuthGuard} from '../auth/auth.guard';
import {ApiBearerAuth} from '@nestjs/swagger';


@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {
    }


    @Get()
    me(@Request() request: any,): Promise<any> {
        const userId: string = request.user.sub.id;

        return this.profileService.me(userId);
    }


    @Delete("logout")
    logout(@Res({passthrough: true}) response: Response): Promise<any> {

        return this.profileService.logout(response);
    }


}
