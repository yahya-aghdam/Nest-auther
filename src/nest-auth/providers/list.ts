import {ProvidersT} from '../interface/providers';

export const providers: ProvidersT = {
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    AccessTokenURL:
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=',
  },
};
