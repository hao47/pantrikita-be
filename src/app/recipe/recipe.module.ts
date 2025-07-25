import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';

import { JwtModule } from '@nestjs/jwt';

import jwtConfig from '../../config/jwtConfig';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [JwtModule.register(jwtConfig),
        PrismaModule,
    ],
    providers: [RecipeService],
    controllers: [RecipeController],
})
export class RecipeModule {}
