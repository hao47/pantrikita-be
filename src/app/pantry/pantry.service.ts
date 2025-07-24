import {
    Injectable,

} from '@nestjs/common';


import { PrismaService } from '../../prisma/prisma.service';

import Constants from '../../constants';
import { capitalizeFirstLetter, ExpiredStatus } from '../../helper/format-to-locale-date';
import { ItemCategory } from '@prisma/client';
import {CommonResponseDto} from "../../dtos/common-response-dto";
import {ItemParamDto} from "../../dtos/item-param-dto";
import {add} from "date-fns";


@Injectable()
export class PantryService {
    constructor(
        private prisma: PrismaService,

    ) {
    }

    async findAll(userId:string, query: ItemParamDto): Promise<CommonResponseDto> {

        const validCategories = Object.values(ItemCategory);
        const inputCategory = query.categories?.toUpperCase();
        const isValidCategory = validCategories.includes(inputCategory as ItemCategory);


        const now = new Date();
        const sevenDaysLater = add(now, { days: 7 });

        let expiringDateFilter: any = undefined;


        // filter
        if (query.status === 'expired') {
            expiringDateFilter = {
                lt: now,
            };
        } else if (query.status === 'fresh') {
            expiringDateFilter = {
                gt: sevenDaysLater,
            };
        } else if (query.status === 'expiring_soon') {
            expiringDateFilter = {
                gte: now,
                lte: sevenDaysLater,
            };
        }


        let sortBy: any = {};

        switch (query.filter) {
            case 'expiry_date':
                sortBy = { expiring_date: 'asc' };
                break;
            case 'name':
                sortBy = { name: 'asc' };
                break;
            case 'category':
                sortBy = { category: 'asc' };
                break;
            case 'date_added':
                sortBy = { created_at: 'desc' };
                break;
            default:
                sortBy = { expiring_date: 'asc' }; // default sorting
        }



        const [item, total,item_header] = await Promise.all([
            this.prisma.item.findMany({
                where: {
                    user_id: userId,
                    name: {
                        contains: query.search, mode: 'insensitive',
                    },
                    category: isValidCategory ? inputCategory as ItemCategory : {},
                    ...(query.status ? { expiring_date: expiringDateFilter } : {}),
                },
                orderBy: sortBy,
            }),
            this.prisma.item.count(),
            this.prisma.item.findMany({
                where: {
                    user_id: userId,
                },
                orderBy: sortBy,
            }),
        ]);

        // format items
        const items = item.map((item) => {
            return {
                id: item.id,
                name: item.name,
                location: item.location,
                status: item.status.toLocaleLowerCase(),
                category: item.category.toLocaleLowerCase(),
                icon: Constants.FoodCategories.find(itemfood => itemfood.name.toLowerCase() === item.category.toLowerCase())?.icon,
                expired: ExpiredStatus(item.expiring_date),
            };
        });


        const items_header = item_header.map((item) => {

            return {
                id: item.id,
                name: item.name,
                location: item.location,
                status: item.status.toLocaleLowerCase(),
                category: item.category.toLocaleLowerCase(),
                icon: Constants.FoodCategories.find(itemfood => itemfood.name.toLowerCase() === item.category.toLowerCase())?.icon,
                expired: ExpiredStatus(item.expiring_date),
            };
        });



        return {
            message: 'Success Get Pantries Data',
            data: {
                total_items: {
                    total: total,
                    fresh: items_header.filter(item => item.expired.status_text === 'Fresh').length,
                    expiring: items_header.filter(item => item.expired.status_text !== 'Expired' && item.expired.status_text !== 'Fresh').length,
                    expired: items_header.filter(item => item.expired.status_text === 'Expired').length,
                },
                items: items,

            },
        };
    }



}
