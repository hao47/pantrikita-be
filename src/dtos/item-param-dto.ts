import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { CATEGORIES, FILTER,  STATUS } from 'src/enums/item-enums.enum';
import { Categories, Filter, Status } from 'src/enums/db-alias.enum';
import { IsEnum, IsNotEmpty } from "class-validator";

export class ItemParamDto {


    @Type()
    @IsEnum(Categories)
    @ApiProperty({
        enum: () => Categories,
        required: false,
        example: "all_categories"
    })
    public readonly categories: CATEGORIES = "all_categories";

    @Type()
    @IsEnum(Status)
    @ApiProperty({
        enum: () => Status,
        required: false,
        example: "all_status"
    })
    public readonly status: STATUS = "all_status";

    @Type()
    @IsEnum(Filter)
    @ApiProperty({
        enum: () => Filter,
        required: false,
        example: Filter.expiry_date
    })
    public readonly filter: FILTER = Filter.expiry_date;


    @Type()
    @ApiProperty({
        required: false,
        description: "",
        example: ""
    })
    public  search: string = "";

}
