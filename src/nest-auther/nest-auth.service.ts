import 'dotenv/config';
const NEST_AUTH_SECRET: string = process.env.NEST_AUTH_SECRET;
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID: string = process.env.GITHUB_CLIENT_ID;
import { Injectable, Res, Req } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import TokenT from './interface/token';
var jwt = require('jsonwebtoken');
import { ProviderListT } from './interface/providers';
import { githubUrls, googleUrls, redirect_api_url } from './providers/url';

/**
 * You can work with Google, Github and local JWT for auth in nest.
 *
 * @param {Request} req - Express request
 * @param {Response} res - Express responce
 * @param {ProviderListT} provider - Provider - Google, Github, JWT (for local usage)
 */
@Injectable()
export default class NestAuther {
  constructor(
    @Req() private req: Request,
    @Res() private res: Response,
    private provider: ProviderListT,
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

  /**
   * Verify token by name that saved in cookies
   *
   * @param {string} tokenName - (optional) Default name for token is `Authorization`
   * @return {TokenT}  Returns an object that has `is_verified` for verification and `data` for decrypted data of token.
   */
  public verifyToken(tokenName: string = 'Authorization'): TokenT {
    let responce: TokenT = {
      is_verified: false,
    };

    if (this.req.headers.cookie != undefined) {
      let cookies = this.parseCookieString(this.req.headers.cookie);

      try {
        const decodedToken = jwt.verify(cookies[tokenName], NEST_AUTH_SECRET);

        if (decodedToken.data.data.expire_at > Date.now()) {
          responce.data = decodedToken;
          responce.is_verified = true;
        }
      } catch (err) {
        console.log(err);
      }
    }
    return responce;
  }

  /**
   * Make token and save it in cookies
   *
   * @param {string} name - Name of token
   * @param {any} data - Data of token
   * @param {CookieOptions} options - (optional) Cookie options
   * @param {string} algorithm - (optional) Cryption algorithm method. Default is RS256
   */
  public makeToken(
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

  /**
   * Redirect user to the provider to auth
   *
   * @param {string} scope - (optional) You can enter your scopes. Default scopes will not work if you add yours.
   */
  public redirectToProvider(scope: string = 'NOT_ENTERED') {
    let url: string;
    let newScope = scope;

    // google
    if (this.provider == 'google') {
      if (scope == 'NOT_ENTERED') newScope = googleUrls.scope;
      const googleParams = new URLSearchParams({
        redirect_uri: redirect_api_url,
        client_id: GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: newScope,
      });
      url = `${googleUrls.mainUrl}${googleParams.toString()}`;
    }

    // github
    if (this.provider == 'github') {
      if (scope == 'NOT_ENTERED') newScope = githubUrls.scope;
      const githubParams = new URLSearchParams({
        redirect_uri: redirect_api_url,
        client_id: GITHUB_CLIENT_ID,
        scope: newScope,
      });
      url = `${githubUrls.mainUrl}${githubParams.toString()}`;
    }

    if (this.provider != undefined) {
      this.makeToken('provider', this.provider);
    }

    return this.res.redirect(url);
  }

    /**
   * Delete token by name
   *
   * @param {string} tokenName - Name of the token will be deleted
   */
  public deleteToken(tokenName: string) {
    this.res.clearCookie(tokenName);
  }
}
