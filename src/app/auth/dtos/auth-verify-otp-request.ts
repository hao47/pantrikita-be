import { IsNotEmpty, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthVerifyOtpRequest {
    @ApiProperty({

    })
    @IsNotEmpty()
    otp: string;


}
