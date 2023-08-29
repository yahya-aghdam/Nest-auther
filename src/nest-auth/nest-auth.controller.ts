import 'dotenv/config';
const MAIN_URL = process.env.MAIN_URL;
import { Controller, Get, Res, Req, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import NestAuth from './nest-auth.service';
import GoogleProvider from './providers/google';

@Controller("api/nest-auth")
export class NestAuthController {
  @Get()
  async auther(
    @Req() req: Request,
    @Res() res: Response,
    nestAuth = new NestAuth(req, res),
  ) {
   
    const provider = nestAuth.verifyToken('provider');
    if (provider.is_verified) {
      console.log('provider verified')
      if (provider.data.data == 'google') {
        console.log('google')
        const google = new GoogleProvider(req, res);
        return await google.tokenMaker()
      }
    } else {
      console.log('no provider')
      nestAuth.deleteToken('provider');
      nestAuth.deleteToken('Authorization');
      return res.redirect('/');
    }
  }
}
