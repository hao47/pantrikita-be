import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

import { JwtModule } from '@nestjs/jwt';

import jwtConfig from '../../config/jwtConfig';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [JwtModule.register(jwtConfig),
        PrismaModule,


    ],
    providers: [HomeService],
    controllers: [HomeController],
})
export class HomeModule {}
