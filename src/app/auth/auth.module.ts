import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';

import jwtConfig from '../../config/jwtConfig';
import { PrismaModule } from '../../prisma/prisma.module';
import process from "node:process";
import {MailerModule} from "@nestjs-modules/mailer";

@Module({
  imports: [JwtModule.register(jwtConfig),
    PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: "smtp.hostinger.com",
        port: 465,
        auth: {
          user: "a@smkradenumarsaid.com",
          pass: "jN4Fm9B:1",
        },
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
