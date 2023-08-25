import 'dotenv/config';

const NEST_AUTH_SECRET: string = process.env.NEST_AUTH_SECRET;
const NEST_AUTH_DOMAIN: string = process.env.NEST_AUTH_DOMAIN;

interface OptionsT {
  domain: string;
  encode?: boolean;
  expires?: number;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean;
  secure?: boolean;
}

export function signer(
  key: string,
  value: any,
  options: OptionsT = {
    domain: NEST_AUTH_DOMAIN,
    maxAge: Date.now() + 1000000,
  },
) {}

export function decoder(session: string) {}
