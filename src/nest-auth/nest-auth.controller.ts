import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import NestAuth from './nest-auth.service';
import GoogleProvider from './providers/google';
import GithubProvider from './providers/github';

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
      // Google
      if (provider.data.data == 'google') {
        const google = new GoogleProvider(req, res);
        return await google.tokenMaker()
      }

      // Github
      if (provider.data.data == 'github') {
        const github = new GithubProvider(req, res);
        return await github.tokenMaker()
      }
      
    } else {
      nestAuth.deleteToken('provider');
      nestAuth.deleteToken('Authorization');
      return res.redirect('/');
    }
  }
}
