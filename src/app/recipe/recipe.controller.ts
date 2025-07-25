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
    constructor(private recipeService: RecipeService) {
    }


    @Get()
    findAll(@Request() request: any,): Promise<any> {
        const userId: string = request.user.sub.id;

        return this.recipeService.findAll(userId);
    }

    @Get("regenerate")
    regenerate(@Request() request: any,): Promise<any> {
        const userId: string = request.user.sub.id;

        return this.recipeService.regenerate(userId);
    }

    @Get(":id")
    findId(@Request() request: any,): Promise<any> {
        const userId: string = request.user.sub.id;

        return this.recipeService.findId(userId);
    }



}
