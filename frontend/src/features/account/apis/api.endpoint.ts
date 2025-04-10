import { environment } from "../../../environments/environment";

export const accountEndpoint = {
  login: `${environment.urls.api}/auth/login`,
  register: `${environment.urls.api}/auth/register`,
  isEmailExist: `${environment.urls.api}/auth/isEmailExist`,
};
