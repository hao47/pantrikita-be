import {
  Body,
  Controller, Get,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthLoginRequest, AuthRegisterRequest } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: AuthLoginRequest,@Res({ passthrough: true }) response: Response,) {
    return this.authService.signIn(signInDto,response);
  }


  @Post('register')
  signUp(@Body() signUpDto: AuthRegisterRequest) {
    return this.authService.signUp({ ...signUpDto });
  }



}
