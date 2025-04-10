import { User, USER_ROLES } from "./user";

export interface AuthState {
  token?: string;
  user?: User;
  expiresAt?: string;
  isFirstTime?: boolean;
}

export interface AuthUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: USER_ROLES[];
  iat?: number;
  exp?: number;
}
