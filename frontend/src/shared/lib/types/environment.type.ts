interface Environment {
  debug: boolean;
  production: boolean;
  urls: {
    api: string;
    accounts: string;
  };
}

type AuthEndpoints = {
  getCurrentUser: {
    endpoint: string;
    protected: boolean;
  };
};
export type { AuthEndpoints, Environment };
