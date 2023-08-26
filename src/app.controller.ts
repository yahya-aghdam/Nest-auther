import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import NestAuth from './nest-auth/nest-auth.service';

@Controller()
export class AppController {

  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    
    const nestAuth = new NestAuth(req,res)

    nestAuth.makeToken('Authorization', 'value');

    const verify = nestAuth.verifyToken('Authorization');
    console.log("🚀 ~ file: app.controller.ts:14 ~ AppController ~ getHello ~ verify:", verify)

    res.send({ message: 'Token saved!' });
  }
}
