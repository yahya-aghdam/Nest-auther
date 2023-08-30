export interface GetTokenRequestInputT {
    code: string;
    clientId: string;
    clientSecret: string;
  }
export interface GetTokenRequestReturn {
  access_token: string;
  token_type: string;
  scope: string;
}