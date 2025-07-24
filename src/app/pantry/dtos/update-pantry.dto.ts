import { IsNotEmpty, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePantryDTO {



    @ApiProperty({
        default: 'consumed',
    })
    @IsNotEmpty()
    status?: string;

}
