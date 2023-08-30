interface ProviderUtlT {
  tokenUrl?: string;
  AcessAPI?: string;
  AcessAPIEmail?: string;
  AccessTokenURL: string;
}

export interface ProvidersT {
  jwt?: string;
  google?: ProviderUtlT;
  github?: ProviderUtlT;
  twitter?: ProviderUtlT;
}

export type ProviderListT = 'google' | 'github' | 'twitter' | 'jwt' ;
