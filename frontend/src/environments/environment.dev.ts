// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  version: "##buildNumber##",
  debug: false,
  production: true,
  googleClientId:
    "477478808814-ktihku8km9hccs496730d687rasgi7bh.apps.googleusercontent.com",
  facebookAppId: "880819489237511",
  urls: {
    api: "http://localhost:4000",
    logServer: "/logServer",
    accounts: "/accounts",
  },
};
