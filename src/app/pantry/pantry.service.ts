import {Injectable, UnprocessableEntityException,} from '@nestjs/common';


import {PrismaService} from '../../prisma/prisma.service';

import Constants from '../../constants';
import {getExpiredStatus} from '../../helper/format-to-locale-date';
import {ItemCategory, Prisma} from '@prisma/client';
import {CommonResponseCreateDto, CommonResponseDto} from "../../dtos/common-response-dto";
import {ItemParamDto} from "../../dtos/item-param-dto";
import {add} from "date-fns";
import PantryMapper from "./mapper/pantry.mapper";
import {UpdatePantryDTO} from "./dtos/update-pantry.dto";
import path from "path";
import fs from "fs";
import {StatusFormat} from "../../enums/db-alias.enum";
import {generateDetailPantry} from "../../helper/ai-api-to-json";


@Injectable()
export class PantryService {
    constructor(
        private prisma: PrismaService,
    ) {
    }

    async findAll(userId: string, query: ItemParamDto): Promise<CommonResponseDto> {

        const validCategories = Object.values(ItemCategory);
        const inputCategory = query.categories?.toUpperCase();
        const isValidCategory = validCategories.includes(inputCategory as ItemCategory);


        const now = new Date();
        const sevenDaysLater = add(now, {days: 7});

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
                sortBy = {expiring_date: 'asc'};
                break;
            case 'name':
                sortBy = {name: 'asc'};
                break;
            case 'category':
                sortBy = {category: 'asc'};
                break;
            case 'date_added':
                sortBy = {created_at: 'desc'};
                break;
            default:
                sortBy = {expiring_date: 'asc'}; // default sorting
        }


        const [item, total, item_header] = await Promise.all([
            this.prisma.item.findMany({
                where: {
                    user_id: userId,
                    name: {
                        contains: query.search, mode: 'insensitive',
                    },
                    category: isValidCategory ? inputCategory as ItemCategory : {},
                    ...(query.status ? {expiring_date: expiringDateFilter} : {}),
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
                expired: getExpiredStatus(item.expiring_date,StatusFormat.SIMPLE),
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
                expired: getExpiredStatus(item.expiring_date,StatusFormat.SIMPLE),
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


    async findId(id: string): Promise<any> {

        const item = await this.prisma.item.findUnique({
            where: {
                id: id.toString(),
            },
            select: {
                name: true,
                use_everything: true,
            },
        });


        if ((item?.use_everything?.length ?? 0) > 0) {
            const itemDetail = await this.prisma.item.findUnique({
                where: {
                    id: id.toString(),
                },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    status: true,
                    expiring_date: true,
                    location: true,
                    use_everything: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            cook_time: true,
                            difficulty: true,
                            ingredient: true,
                            instruction: true,
                        },
                    },
                    composting: {
                        select: {
                            environmental_impact: true,
                            orders: true,
                        },
                    },
                    recipe: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            difficulty: true,
                            cook_time: true,
                        },
                    },
                },
            });

            const headerStatus = getExpiredStatus(itemDetail!.expiring_date, StatusFormat.HEADER);
            const detailedStatus = getExpiredStatus(itemDetail!.expiring_date, StatusFormat.DETAILED);


            const itemDetailFormat = {
                id: itemDetail?.id,
                icon: Constants.FoodCategories.find(itemfood => itemfood.name.toLowerCase() === itemDetail?.category.toLowerCase())?.icon,
                name: itemDetail?.name,
                category: itemDetail?.category,
                header_status: headerStatus,
                body_status: detailedStatus,
                location: itemDetail?.location,
                recipe: itemDetail?.recipe,
                use_everything: itemDetail?.use_everything,
                composting: {
                    enviromental_impact: itemDetail?.composting[0].environmental_impact,
                    orders: itemDetail?.composting[0].orders.map(itemfood => itemfood.description),
                },

            };

            return {
                status: 'Success get Item Detail',
                data: itemDetailFormat,
            };


        } else {


            let inputItem = item?.name;


            const parsed = await generateDetailPantry(inputItem!);



            for (let i = 0; i < parsed["suggestedRecipes"].length; i++) {
                await this.prisma.itemRecipe.create({
                    data: {

                        item: {
                            connect: {
                                id: id,
                            },
                        },
                        title: parsed['suggestedRecipes'][i].title,
                        description: parsed['suggestedRecipes'][i].description,
                        cook_time: parsed['suggestedRecipes'][i].time,
                        difficulty: parsed['suggestedRecipes'][i].difficulty,
                    },
                });
            }

            for (let i = 0; i < parsed["zeroWasteRecipes"].length; i++) {
                await this.prisma.itemUseEverything.create({
                    data: {

                        item: {
                            connect: {
                                id: id,
                            },
                        },
                        title: parsed['zeroWasteRecipes'][i].title,
                        description: parsed['zeroWasteRecipes'][i].description,
                        cook_time: parsed['zeroWasteRecipes'][i].time,
                        difficulty: parsed['zeroWasteRecipes'][i].difficulty,
                        ingredient: parsed['zeroWasteRecipes'][i].ingredients,
                        instruction: parsed['zeroWasteRecipes'][i].instructions,
                    },
                });
            }


            const item_composting_id = await this.prisma.itemComposting.create({
                data: {
                    environmental_impact: parsed['compostingGuide']['environmentalImpact'],

                    item: {
                        connect: {
                            id: id,
                        },
                    },
                },
            });

            for (let i = 0; i < parsed["compostingGuide"]["tips"].length; i++) {
                await this.prisma.itemCompostingOrder.create({
                    data: {
                        item_composting: {
                            connect: {
                                id: item_composting_id.id,
                            },
                        },
                        description: parsed['compostingGuide']['tips'][i],
                    },
                });
            }

            const itemDetail = await this.prisma.item.findUnique({
                where: {
                    id: id.toString(),
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            return {
                status: 'Success get Item Detail',
                data: itemDetail,
            };


        }

    }


    async update(id: string, dto: UpdatePantryDTO): Promise<CommonResponseCreateDto> {

        try {
            await this.prisma.$transaction(async (prisma) => {
                let data: Prisma.ItemUpdateInput = await PantryMapper.pantryUpdateRequestDTOToPantryUpdateInput(dto);

                await prisma.item.update({
                    where: {
                        id: id,
                    },
                    data,
                });
            });

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === 'P3000') {
                    throw new UnprocessableEntityException('Failed to update Item');
                } else if (e.code === 'P2025') {

                    if (e.meta!.cause == 'Record to update not found.') {
                        throw new UnprocessableEntityException('ID Pantry Not Found');
                    } else {
                        throw new UnprocessableEntityException('There is no Pantry Id Asosiated with the ID');
                    }

                }
            }
            throw e;
        }


        return {
            message: 'successfully to update Pantry',
        };
    }


    async remove(id: string): Promise<CommonResponseCreateDto> {

        try {
            await this.prisma.item.delete({
                where: {
                    id: id,
                },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P3000') {
                    throw new UnprocessableEntityException(
                        'failed to remove Item',
                    );
                } else if (e.code === 'P2025') {
                    throw new UnprocessableEntityException(
                        'id Item Not Found',
                    );
                }
            }
            throw e;
        }


        return {
            message: 'successfully to remove Pantry',
        };
    }


}
