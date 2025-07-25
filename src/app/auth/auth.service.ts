import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginRequest, AuthRegisterRequest } from './dtos';
import { isNil } from '@nestjs/common/utils/shared.utils';
import * as bcrypt from 'bcrypt';

import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../prisma/prisma.service';

import { JwtResponseDto } from '../../dtos/jwt-response.dto';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import {
    CommonResponseDto,
    CommonResponseCreateDto
} from '../../dtos/common-response-dto';

import AuthMapper from './mapper/auth.mapper';
import { Prisma } from '@prisma/client';
import {GenerateOTP} from "../../helper/format-to-locale-date";
import {AuthVerifyOtpRequest} from "./dtos/auth-verify-otp-request";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly mailService: MailerService
    ) {
    }

    async signIn(dto: AuthLoginRequest,response: any): Promise<CommonResponseDto> {
        const { email, password } = dto;

        const user = await this.prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        const checkUser = isNil(user);

        const comparePassword = !bcrypt.compareSync(
            password,
            checkUser ? '' : user.password,
        );
        console.log(comparePassword);

        if (comparePassword || checkUser)
            throw new UnauthorizedException('Your email or password is incorrect');

        const payload: JwtResponseDto = {
            sub: { id: user.id, username: user.username, email: user.email },
        };



        return {
            message:"Success Login",
            data:{
                accessToken: await this.jwtService.signAsync(payload,),
                nama: user.username,
            }
        };
    }

    async signUp(dto: AuthRegisterRequest): Promise<CommonResponseCreateDto> {
        const otp = GenerateOTP()
        const data: Prisma.UserCreateInput =
            await AuthMapper.authSignUpRequestDTOToUserCreateInput(dto);


        try {
            await this.prisma.user.create({ data });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new UnprocessableEntityException(
                            'Name is already taken, please use a different name',
                        );
                    case 'P3000':
                        throw new UnprocessableEntityException(
                            'An error occurred, failed to register',
                        );
                    default:
                        throw error;
                }
            } else {
                throw error;
            }
        }


        return {
            message: 'You have successfully registered',
        };

    }





}
