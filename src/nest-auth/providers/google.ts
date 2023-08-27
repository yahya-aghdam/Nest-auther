import 'dotenv/config';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REDIRECT_BACK = process.env.REDIRECT_BACK;

import { Injectable, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { providers } from './list';
import NestAuth from '../nest-auth.service';

@Injectable()
export default class GoogleProvider {
  constructor(
    @Req() private req: Request,
    @Res() private res: Response,
    private nestAurh = new NestAuth(req, res,'google'),
  ) {
    this.tokenMaker();
  }

  private async getTokens({
    code,
    clientId,
    clientSecret,
    REDIRECT_URI,
  }: {
    code: string;
    clientId: string;
    clientSecret: string;
    REDIRECT_URI: string;
  }): Promise<{
    access_token: string;
    expire_at: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }> {
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    try {
      const searchParams = new URLSearchParams(values);

      const res = await fetch(providers.google.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams.toString(),
      });
      return res.json();
    } catch (error: any) {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    }
  }

  async tokenMaker() {
    const code = this.req.query.code as string;

    const { id_token, access_token } = await this.getTokens({
      code,
      clientId: GOOGLE_CLIENT_ID ,
      clientSecret: GOOGLE_CLIENT_SECRET ,
      REDIRECT_URI: GOOGLE_REDIRECT_URI,
    });

    // Fetch the user's profile with the access token and bearer
    let googleUser = await fetch(providers.google.AccessTokenURL + access_token, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error(error.message);
      });

    const expire_at_int = Date.now() + 15 * 24 * 60 * 60 * 1000; // One month
    const expire_at = JSON.stringify(expire_at_int);
    googleUser['expire_at'] = expire_at;

    // save token in cookie
    this.nestAurh.makeToken('Authorization', googleUser);

    //   Redirect user
    this.res.redirect(REDIRECT_BACK as string);
  }
}
