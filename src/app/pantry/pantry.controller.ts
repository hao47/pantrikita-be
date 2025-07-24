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
import { PantryService } from './pantry.service';

import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import {ItemParamDto} from "../../dtos/item-param-dto";
import {ParamDTOPipeTransform} from "../../transforms/param-dto.pipe-transfrom";


@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('home')
export class HomeController {
    constructor(private pantryService: PantryService) {}


    @Get()
    findAll(@Request() request: any,  @Query(new ParamDTOPipeTransform())
        query: ItemParamDto): Promise<any>  {
        const userId: string = request.user.sub.id;

        return this.pantryService.findAll(userId,query);
    }



}
