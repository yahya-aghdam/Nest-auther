import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import NestAuther from './nest-auth.service';
import GoogleProvider from './providers/google';
import GithubProvider from './providers/github';

@Controller("api/nest-auth")
export class NestAutherController {
  @Get()
  async auther(
    @Req() req: Request,
    @Res() res: Response,
    nestAuther = new NestAuther(req, res),
  ) {
   
    const provider = nestAuther.verifyToken('provider');
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
      nestAuther.deleteToken('provider');
      nestAuther.deleteToken('Authorization');
      return res.redirect('/');
    }
  }
}
