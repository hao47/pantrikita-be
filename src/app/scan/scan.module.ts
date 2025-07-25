import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';

import { JwtModule } from '@nestjs/jwt';

import jwtConfig from '../../config/jwtConfig';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [JwtModule.register(jwtConfig),
        PrismaModule,


    ],
    providers: [ScanService],
    controllers: [ScanController],
})
export class ScanModule {}
