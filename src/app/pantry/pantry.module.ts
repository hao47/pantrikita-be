import { Module } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { PantryController} from './pantry.controller';

import { JwtModule } from '@nestjs/jwt';

import jwtConfig from '../../config/jwtConfig';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [JwtModule.register(jwtConfig),
        PrismaModule,


    ],
    providers: [PantryService],
    controllers: [PantryController],
})
export class PantryModule {}
