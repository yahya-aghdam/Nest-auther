import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import NestAuth from './nest-auth/nest-auth.service';

@Controller()
export class AppController {
  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    const nestAuth = new NestAuth(req, res, 'google');
    if (!nestAuth.verifyToken()) {
      return nestAuth.redirectToProvider();
    } else {
      res.send({ message: 'Token saved!' });
    }
  }
}
