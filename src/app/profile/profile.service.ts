import {
    Injectable,

} from '@nestjs/common';


import {PrismaService} from '../../prisma/prisma.service';

import Constants from '../../constants';
import {capitalizeFirstLetter, getExpiredStatus} from '../../helper/format-to-locale-date';
import {ItemCategory} from '@prisma/client';
import {CommonResponseDto} from "../../dtos/common-response-dto";
import {isNil} from "@nestjs/common/utils/shared.utils";


@Injectable()
export class ProfileService {
    constructor(
        private prisma: PrismaService,
    ) {
    }


    async me(userId: string): Promise<CommonResponseDto> {


        const [profile, items, total] = await Promise.all([
            this.prisma.user.findFirst({
                select: {
                    id: true,
                    email: true,
                    username: true,
                },
                where: {
                    id: userId
                },
            }),
            this.prisma.item.findMany({
                where: {
                    user_id: userId,
                },
            }),
            this.prisma.item.count(),
        ]);


        const pantries = items.map((item) => {

            return {
                id: item.id,
                name: item.name,
                location: item.location,
                status: item.status.toLocaleLowerCase(),
                category: item.category.toLocaleLowerCase(),
                icon: Constants.FoodCategories.find(itemfood => itemfood.name.toLowerCase() === item.category.toLowerCase())?.icon,
                expired: getExpiredStatus(item.expiring_date),
            };
        });


        let total_food_save: Number = pantries.filter(item => item.status === 'CONSUMED'.toLocaleLowerCase()).length
        let total_expiring_soon: Number = pantries.filter(item => item.expired.status_text !== 'Expired' && item.expired.status_text !== 'Fresh').length
        let percentage_waste_reduce = Math.round(((pantries.filter(item => item.status === 'CONSUMED'.toLocaleLowerCase()).length + pantries.filter(item => item.status === 'COMPOST'.toLocaleLowerCase()).length) / pantries.length) * 100)


        return {
            message: "Success Get Profile Data",
            data: {
                bio: profile,
                impact: {
                    food_save: total_food_save,
                    waste_reduce: `${isNaN(percentage_waste_reduce) ? 0 :percentage_waste_reduce}%`,
                    item_scanned:total,
                    expiring_soon: total_expiring_soon
                }
            },

        };
    }

    async logout(response: any) {
        response.clearCookie('refreshToken');

        return {message: 'Logout successful'};
    }


}
