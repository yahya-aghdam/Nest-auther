import 'dotenv/config';
const NEST_AUTH_SECRET: string = process.env.NEST_AUTH_SECRET;
import { Injectable, Res, Req } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import TokenT from './interface/token';
var jwt = require('jsonwebtoken');

@Injectable()
export default class NestAuth {
  constructor(
    @Req() private req: Request,
    @Res() private res: Response,
  ) {}

  private parseCookieString(cookieString: string): Record<string, string> {
    const cookiePairs = cookieString.split('; ');
    const cookieObject: Record<string, string> = {};

    for (const cookiePair of cookiePairs) {
      const [key, value] = cookiePair.split('=');
      cookieObject[key] = value;
    }

    return cookieObject;
  }

  verifyToken(tokenName: string = 'Authorization'): TokenT {
    let cookies = this.parseCookieString(this.req.headers.cookie);
    let responce: TokenT = {
      is_verified: false,
    };
    try {
      responce.data = jwt.verify(cookies[tokenName], NEST_AUTH_SECRET);

      responce.is_verified = true;
    } catch (err) {
      console.log(err);
    }

    return responce;
  }

  makeToken(
    name: string,
    data: any,
    options?: CookieOptions,
    algorithm?: string,
  ): void {
    const token = jwt.sign(
      {
        data: data,
        algorithm: algorithm,
      },
      NEST_AUTH_SECRET,
    );

    this.res.cookie(name, token, options);
  }
}