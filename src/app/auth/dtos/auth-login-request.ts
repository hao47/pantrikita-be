import { IsNotEmpty, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequest {
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
