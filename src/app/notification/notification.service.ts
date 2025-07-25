import {
    Injectable,

} from '@nestjs/common';


import { PrismaService } from '../../prisma/prisma.service';

import Constants from '../../constants';
import { capitalizeFirstLetter, getExpiredStatus } from '../../helper/format-to-locale-date';
import { ItemCategory } from '@prisma/client';
import {format} from "date-fns";


@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService,

    ) {
    }

    async findAll(userId:string): Promise<any> {


        const [notifications] = await Promise.all([
            this.prisma.notification.findMany({
                where: {
                    user_id: userId,
                },
                select:{
                    title:true,
                    description:true,
                    created_at:true
                }

            }),
        ]);


        const formatNotifications = notifications.map(item =>{


            return {
                title:item.title,
                description:item.description,
                created_at: format(item.created_at,"HH:mm")
            }

        })




        return {
            messsage: "Success Get Home Data",
            data: formatNotifications
        };
    }



}
