import { ItemCategory, ItemStatus, Prisma } from '@prisma/client';
import { ScanRequestDto } from '../dto/create-scan.dto';
import {FormatToIsoString} from "../../../helper/format-to-locale-date";

;


export default class ScanMapper {


    static async scanRequestDTOToScanCreateInput(
        dto: ScanRequestDto,
        userId: String,
    ): Promise<Prisma.ItemCreateInput> {


        const expiring_date = FormatToIsoString(dto.expiring_date);


        return {
            name: dto.name,
            location: dto.location,
            expiring_date: expiring_date,
            status: ItemStatus.NOTHING,
            category: dto.category.toUpperCase() as ItemCategory,
            user: { connect: { id: userId.toString() } }, // nanti di handle sama try catch nya jika id tidak ada
        };


    }
}

