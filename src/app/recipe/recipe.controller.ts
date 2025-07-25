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
} from '@nestjs/common';
import {RecipeService} from './recipe.service';

import {AuthGuard} from '../auth/auth.guard';
import {ApiBearerAuth} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('recipe')
export class RecipeController {
    constructor(private homeService: RecipeService) {
    }


    @Get()
    findAll(@Request() request: any,): Promise<any> {
        const userId: string = request.user.sub.id;

        return this.homeService.findAll(userId);
    }

    @Get("regenerate")
    regenerate(@Request() request: any,): Promise<any> {
        const userId: string = request.user.sub.id;

        return this.homeService.regenerate(userId);
    }


}
