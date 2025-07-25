import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    UseGuards,
    Request,
    Patch, Param, ParseUUIDPipe, Put,
} from '@nestjs/common';
import {RecipeService} from './recipe.service';

import {AuthGuard} from '../auth/auth.guard';
import {ApiBearerAuth} from '@nestjs/swagger';
import {CommonResponseCreateDto, CommonResponseDto} from "../../dtos/common-response-dto";
import {BulkUpdateSavedRecipeIngredientDto} from "./dtos/bulk-update-recipe";

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
    findId(@Param("id", ParseUUIDPipe) id: string): Promise<CommonResponseDto> {


        return this.recipeService.findId(id);
    }


    @Put(":id")
    update(@Param("id", ParseUUIDPipe) id: string, @Body() bulkUpdateSavedRecipeIngredientDto: BulkUpdateSavedRecipeIngredientDto): Promise<CommonResponseCreateDto> {
        return this.recipeService.update(id,bulkUpdateSavedRecipeIngredientDto);
    }


}
