import { Controller, Get,Res } from '@nestjs/common';
import { Response } from 'express';
import NestAuth from './nest-auth/nest-auth.service';

@Controller()
export class AppController {
  constructor(
    private nestAuth: NestAuth,
  ) {}

  @Get()
  getHello(@Res() res:Response): void {

    this.nestAuth.makeToken(res,'name','value')

    res.send({ message: 'Token saved!' })
  }
}
