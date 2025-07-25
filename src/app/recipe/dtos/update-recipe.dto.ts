import {IsString, IsBoolean, IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateSavedRecipeIngredientDto {
    @ApiProperty({
        example: 'clxgk28z20001t8b4sd7cfvfd',
        description: 'ID unik from savedRecipeIngredient',
    })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({
        example: 'Organic Milk',
        description: 'name of pantry or item',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: true,
        description: 'Status whether this pantry has used by user',
    })
    @IsBoolean()
    is_check: boolean;
}
