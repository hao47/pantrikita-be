import { Module } from '@nestjs/common';
import {AuthModule} from "./app/auth/auth.module";
import {HomeModule} from "./app/home/home.module";
import {ProfileModule} from "./app/profile/profile.module";
import { ConfigModule } from '@nestjs/config';
import {PantryModule} from "./app/pantry/pantry.module";
import {RecipeModule} from "./app/recipe/recipe.module";
import {NotificationModule} from "./app/notification/notification.module";
import {ScanModule} from "./app/scan/scan.module";

@Module({
  imports: [AuthModule,HomeModule,ProfileModule,PantryModule,RecipeModule,NotificationModule,ScanModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
