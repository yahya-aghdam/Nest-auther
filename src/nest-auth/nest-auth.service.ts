import 'dotenv/config';
const NEST_AUTH_SECRET: string = process.env.NEST_AUTH_SECRET;
const NEST_AUTH_DOMAIN: string = process.env.NEST_AUTH_DOMAIN;
import { Injectable, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import TokenT from './interface/token';
var jwt = require('jsonwebtoken');

@Injectable()
export default class NestAuth {
  verifyToken(token: string): TokenT {
    let responce: TokenT = {
      is_verified: false,
    };
    try {
      responce.data = jwt.verify(NEST_AUTH_SECRET, token);
      responce.is_verified = true;
    } catch (err) {
      console.log(err);
    }

    return responce;
  }

  makeToken(
    @Res() res: Response,
    name: string,
    data: any,
    options?: CookieOptions,
    algorithm: string = 'HS256',
  ): void {
    const token = jwt.sign(
      {
        data: data,
        algorithm: algorithm,
      },
      NEST_AUTH_SECRET,
    );

    res.cookie(name, token,options);
  }
}
