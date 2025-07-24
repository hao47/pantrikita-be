import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterRequest {
    @ApiProperty({
        default: 'Daffa',
        description: 'Username can not be empty',
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        default: 'daffarobani551@gmail.com',
        description: 'Email can not be empty',
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        default: '12345678',
        description: 'Password can not be empty',
    })
    @IsNotEmpty()
    password: string;
}
