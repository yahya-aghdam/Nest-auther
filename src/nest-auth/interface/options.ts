export default interface OptionsT {
    domain: string;
    encode?: boolean;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean;
    secure?: boolean;
  }
  