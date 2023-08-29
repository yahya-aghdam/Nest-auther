import 'dotenv/config';
const MAIN_URL = process.env.MAIN_URL;


export const redirect_api_url: string = `${MAIN_URL}api/nest-auth`;

export const googleUrls = {
  mainUrl: 'https://accounts.google.com/o/oauth2/v2/auth?',
  scope:
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
};
