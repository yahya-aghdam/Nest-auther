import 'dotenv/config';
const MAIN_URL = process.env.MAIN_URL;

// make redirect api url
const urlValues = {
  api: 'api',
  controller: 'nest-auth',
};
const urlParams = new URLSearchParams(urlValues);
export const redirect_api_url: string = `${MAIN_URL}${urlParams.toString()}`;

export const googleUrls = {
  mainUrl: 'https://accounts.google.com/o/oauth2/v2/auth?',
  scope:
    'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email',
};
