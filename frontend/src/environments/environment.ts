// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

import { Environment } from "../../../shared/lib/types/environment.type";

export const environment: Environment = {
  debug: false,
  production: false,
  urls: {
    api: import.meta.env.VITE_APP_API_HOST,
    accounts: "/accounts",
  },
};
