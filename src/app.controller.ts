import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import NestAuther from './nest-auther/nest-auther.service';

@Controller()
export class AppController {
  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    const nestAuther = new NestAuther(req, res, 'google');
    if (!nestAuther.verifyToken().is_verified) {
      return nestAuther.redirectToProvider();
    } else {
      console.log(nestAuther.verifyToken().data)
      res.send({ message: 'Token saved!' });
    }
  }
}
