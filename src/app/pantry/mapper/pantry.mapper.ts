import {UpdatePantryDTO} from "../dtos/update-pantry.dto";
import {ItemStatus, Prisma} from "@prisma/client";


export default class PantryMapper {


    static async pantryUpdateRequestDTOToPantryUpdateInput(
        dto: UpdatePantryDTO,
    ): Promise<Prisma.ItemUpdateInput> {

        return {
            status: dto.status?.toUpperCase() as ItemStatus
        };
    }
}
