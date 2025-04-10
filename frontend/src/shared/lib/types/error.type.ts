export interface APIError {
  data: Data;
  status: number;
  statusText: string;
  headers: APIErrorHeaders;
  config: Config;
  request: Request;
}

export interface Config {
  transitional: Transitional;
  adapter: string[];
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Request;
  headers: ConfigHeaders;
  method: string;
  url: string;
  data: string;
}

export type Request = object;

export interface ConfigHeaders {
  Accept: string;
  "Content-Type": string;
}

export interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

export interface Data {
  message: string;
  error: string;
  statusCode: number;
}

export interface APIErrorHeaders {
  "content-length": string;
  "content-type": string;
}
