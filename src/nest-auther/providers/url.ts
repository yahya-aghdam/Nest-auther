import {ProviderURLT} from '../interface/providers'
import 'dotenv/config';
const MAIN_URL = process.env.MAIN_URL;
let mainUrl = MAIN_URL;
if (!MAIN_URL.endsWith('/')) mainUrl = mainUrl + '/';
export const redirect_api_url: string = `${MAIN_URL}api/nest-auther`;

export const googleUrls:ProviderURLT = {
  mainUrl: 'https://accounts.google.com/o/oauth2/v2/auth?',
  scope:
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  AccessTokenURL:
    'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=',
};

export const githubUrls = {
  mainUrl: 'https://github.com/login/oauth/authorize?',
  scope: 'read:user user:email',
  AcessAPI: 'https://api.github.com/user',
  AcessAPIEmail: 'https://api.github.com/user/emails',
  AccessTokenURL: 'https://github.com/login/oauth/access_token?',
};

