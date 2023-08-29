import 'dotenv/config';
const NEST_AUTH_SECRET: string = process.env.NEST_AUTH_SECRET;
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
import { Injectable, Res, Req } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import TokenT from './interface/token';
var jwt = require('jsonwebtoken');
import { ProviderListT } from './interface/providers';
import { googleUrls, redirect_api_url } from './providers/url';

@Injectable()
export default class NestAuth {
  constructor(
    @Req() private req: Request,
    @Res() private res: Response,
    private provider?: ProviderListT,
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
    let responce: TokenT = {
      is_verified: false,
    };

    if (this.req.headers.cookie != undefined) {
      let cookies = this.parseCookieString(this.req.headers.cookie);

      try {
        responce.data = jwt.verify(cookies[tokenName], NEST_AUTH_SECRET);

        responce.is_verified = true;
      } catch (err) {
        console.log(err);
      }
    }
    return responce;
  }

  makeToken(
    name: string,
    data: any,
    options?: CookieOptions,
    algorithm?: string,
  ) {
    const token = jwt.sign(
      {
        data: data,
        algorithm: algorithm,
      },
      NEST_AUTH_SECRET,
    );

    return this.res.cookie(name, token, options);
  }

  redirectToProvider(scope: string = googleUrls.scope) {
    let url: string;

    // google
    if (this.provider == 'google') {
      const googleValues = {
        redirect_uri: redirect_api_url,
        client_id: GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: scope,
      };
      const googleParams = new URLSearchParams(googleValues);
      url = `${googleUrls.mainUrl}${googleParams.toString()}`;
    }

    if (this.provider != undefined) {
      this.makeToken('provider', this.provider);
    }
    return this.res.redirect(url);
  }

  deleteToken(tokenName: string) {
    this.res.clearCookie(tokenName);
  }
}
