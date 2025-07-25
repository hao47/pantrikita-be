import {
    Injectable, UnprocessableEntityException,

} from '@nestjs/common';


import { PrismaService } from '../../prisma/prisma.service';

import Constants from '../../constants';
import { capitalizeFirstLetter, getExpiredStatus } from '../../helper/format-to-locale-date';
import {ItemCategory, Prisma} from '@prisma/client';
import {format} from "date-fns";
import {ScanRequestDto} from "./dto/create-scan.dto";
import ScanMapper from "./mapper/scan.mapper";


@Injectable()
export class ScanService {
    constructor(
        private prisma: PrismaService,

    ) {
    }

    async create(dto:ScanRequestDto,userId:string): Promise<any> {


        const data: Prisma.ItemCreateInput =
            await ScanMapper.scanRequestDTOToScanCreateInput(dto,userId);



        try {
            await this.prisma.item.create({
                data: data
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P3000") {
                    throw new UnprocessableEntityException("failed to create Scan");
                }
            }
            throw e;
        }


        return {
            message: "Success Create Scan Data",
        };
    }



}
