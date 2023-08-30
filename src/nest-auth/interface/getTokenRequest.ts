export interface GetTokenRequestInputT {
    code: string;
    clientId: string;
    clientSecret: string;
  }
export interface GetTokenRequestReturn {
  access_token: string;
  token_type: string;
  scope: string;
  expire_at?: Number;
  refresh_token?: string;
  id_token?: string;
}