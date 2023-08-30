import 'dotenv/config';
const GOOGLE_CLIENT_ID:string = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET:string = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_BACK:string = process.env.REDIRECT_BACK;

import { Injectable, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { providers } from './list';
import NestAuth from '../nest-auth.service';
import { redirect_api_url } from './url';

@Injectable()
export default class GoogleProvider {
  constructor(
    @Req() private req: Request,
    @Res() private res: Response,
  ) {}
  private nestAuth = new NestAuth(this.req, this.res, 'google');

  private async getTokenRequest({
    code,
    clientId,
    clientSecret,
  }: {
    code: string;
    clientId: string;
    clientSecret: string;
  }): Promise<{
    access_token: string;
    expire_at: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }> {

    try {
      const searchParams = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirect_api_url,
        grant_type: 'authorization_code',
      });

      const res = await fetch(providers.google.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams.toString(),
      });
      return res.json();
    } catch (error: any) {
      console.error("Failed to fetch auth tokens");
      throw new Error(error.message);
    }
  }

  async tokenMaker() {
    const code : string = this.req.query.code as string;

    const { id_token, access_token } = await this.getTokenRequest({
      code,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    });

    // Fetch the user's profile with the access token and bearer
    let googleUser = await fetch(
      providers.google.AccessTokenURL + access_token,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    )
      .then((res) => res.json())
      .catch((error) => {
        console.error("Failed to create authed token");
        throw new Error(error.message);
      });

    googleUser['expire_at'] = Date.now() + 15 * 24 * 60 * 60 * 1000; // One month

    // save token in cookie
    this.nestAuth.makeToken('Authorization', googleUser);
    this.nestAuth.deleteToken('provider')
    //   Redirect user
    this.res.redirect(REDIRECT_BACK);
    
  }
}
