import { Module } from '@nestjs/common';
import {AuthModule} from "./app/auth/auth.module";
import {HomeModule} from "./app/home/home.module";
import {ProfileModule} from "./app/profile/profile.module";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule,HomeModule,ProfileModule,ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
