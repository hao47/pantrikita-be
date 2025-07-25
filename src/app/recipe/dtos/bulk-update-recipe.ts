import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateSavedRecipeIngredientDto } from './update-recipe.dto';

export class BulkUpdateSavedRecipeIngredientDto {
    @ApiProperty({
        type: [UpdateSavedRecipeIngredientDto],

    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateSavedRecipeIngredientDto)
    ingredients: UpdateSavedRecipeIngredientDto[];
}
