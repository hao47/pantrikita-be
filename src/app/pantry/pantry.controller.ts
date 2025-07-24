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
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';
import { PantryService } from './pantry.service';

import { AuthGuard } from '../auth/auth.guard';
import {ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {ItemParamDto} from "../../dtos/item-param-dto";
import {ParamDTOPipeTransform} from "../../transforms/param-dto.pipe-transfrom";
import {UpdatePantryDTO} from "./dtos/update-pantry.dto";


@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('pantry')
export class PantryController {
    constructor(private pantryService: PantryService) {}


    @Get()
    findAll(@Request() request: any,  @Query(new ParamDTOPipeTransform())
        query: ItemParamDto): Promise<any>  {
        const userId: string = request.user.sub.id;

        return this.pantryService.findAll(userId,query);
    }

    @Get(":id")

    findId(@Param("id", ParseUUIDPipe) id: string) {
        return this.pantryService.findId(id);
    }



    @Put(":id")
    @ApiOperation({

        description: 'tersedia 3 status consumed,compost,thrown pilih salah satu'
    })
    update(@Param("id", ParseUUIDPipe) id: string, @Body() updateAnakDto: UpdatePantryDTO) {
        return this.pantryService.update(id, updateAnakDto);
    }


    @Delete(":id")
    remove(@Param("id", ParseUUIDPipe) id: string) {
        return this.pantryService.remove(id);
    }


}
