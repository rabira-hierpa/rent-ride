import {
  AuthEndpoints,
  Environment,
} from "../../../shared/lib/types/environment.type";

export const authEndpoints = (environment: Environment): AuthEndpoints => ({
  getCurrentUser: {
    endpoint: `${environment.urls.api}/user/getCurrentUser`,
    protected: true,
  },
});
