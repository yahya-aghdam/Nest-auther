import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import NestAuth from './nest-auth/nest-auth.service';

@Controller()
export class AppController {
  constructor(private nestAuth: NestAuth) {}

  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    this.nestAuth.makeToken(res, 'Authorization', 'value');

    const verify = this.nestAuth.verifyToken(req, 'Authorization');

    res.send({ message: 'Token saved!' });
  }
}
