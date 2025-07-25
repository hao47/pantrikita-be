import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { format } from 'date-fns';
import {Category} from "../../../enums/db-alias.enum";
import {IsDateFormat} from "../../../decorator/date-format.decorator";

export class ScanRequestDto {

    @ApiProperty({
        default: 'Organic Milk',
        description: 'Item name must not be empty',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        enum: Category,
        default: Category.DAIRY.toLowerCase(),
        description: 'Category must not be empty',
    })
    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;

    @ApiProperty({
        example: format(Date.now(), 'yyyy/MM/dd'),
        description: 'Date must follow the format `yyyy/MM/dd` and must not be empty',
    })
    @IsNotEmpty()
    @IsDateFormat({ message: 'Date must follow the format yyyy/MM/dd' })
    expiring_date: Date;

    @ApiProperty({
        default: 'Refrigerator',
        description: 'Location must not be empty',
    })
    @IsNotEmpty()
    location: string;
}
