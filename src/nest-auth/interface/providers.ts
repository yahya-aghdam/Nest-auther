interface ProviderUtlT {
  tokenUrl: string;
  AccessTokenURL: string;
}

export interface ProvidersT {
  jwt?: string;
  google?: ProviderUtlT;
  github?: ProviderUtlT;
  twitter?: ProviderUtlT;
}

export type ProviderListT = 'google' | 'github' | 'twitter' | 'jwt' ;
