import { ProvidersT } from '../interface/providers';

export const providers: ProvidersT = {
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    AccessTokenURL:
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=',
  },
  github: {
    AcessAPI: 'https://api.github.com/user',
    AcessAPIEmail: 'https://api.github.com/user/emails',
    AccessTokenURL: 'https://github.com/login/oauth/access_token?',
  },
};
