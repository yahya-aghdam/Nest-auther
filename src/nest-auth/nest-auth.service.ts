import 'dotenv/config';
const NEST_AUTH_SECRET: string = process.env.NEST_AUTH_SECRET;
const NEST_AUTH_DOMAIN: string = process.env.NEST_AUTH_DOMAIN;
import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import TokenT from './interface/token';
import OptionsT from './interface/options';
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

  makeSession(
    data: any,
    algorithm: string = 'HS256',
    options: OptionsT = {
      domain: NEST_AUTH_DOMAIN,
      maxAge: Date.now() + 1000000,
    },
  ): void {
    const token = jwt.sign(
      {
        exp: options.maxAge,
        data: data,
        algorithm: algorithm,
      },
      NEST_AUTH_SECRET,
    );

    return token;
  }
}
