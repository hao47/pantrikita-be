import {
    Injectable,

} from '@nestjs/common';


import { PrismaService } from '../../prisma/prisma.service';

import Constants from '../../constants';
import { capitalizeFirstLetter, getExpiredStatus } from '../../helper/format-to-locale-date';
import { ItemCategory } from '@prisma/client';


@Injectable()
export class HomeService {
    constructor(
        private prisma: PrismaService,

    ) {
    }

    async findAll(userId:string): Promise<any> {


        const [pantries, total] = await Promise.all([
            this.prisma.item.findMany({
                where: {
                    user_id: userId,
                },

            }),

            this.prisma.item.count(),
        ]);

        const items = pantries.map((item) => {

            return {
                id: item.id,
                name: item.name,
                location: item.location,
                status: item.status.toLowerCase(),
                category: capitalizeFirstLetter(item.category),
                icon: Constants.FoodCategories.find(itemfood => itemfood.name.toLowerCase() === item.category.toLowerCase())?.icon,
                expired: getExpiredStatus(item.expiring_date),
            };
        });


        let expired = items.filter(item => item.expired.status_text === 'Expired');
        let expiring_soon = items.filter(item => item.expired.status_text !== 'Expired' && item.expired.status_text !== 'Fresh');



        let content = ""

        if(expired.length > 0 && expiring_soon.length > 0){
            content = `${expired.length} items expired, ${expiring_soon.length} items expiring soon`
        }else if(expired.length > 0){
            content = `${expired.length} Items expired`
        }else if(expiring_soon.length > 0){
            content = `${expiring_soon.length} Items expiring soon`
        }

        return {
            messsage: "Success Get Home Data",
            data: {
                attention_needed:{
                    is_needed:(expired.length + expiring_soon.length) > 0 ,
                    content: content
                },
                total:{
                    total_items: total,
                    expiring_soon: items.filter(item => item.expired.status_text !== 'Expired' && item.expired.status_text !== 'Fresh').length
                },
                items: items
            },
        };
    }



}
