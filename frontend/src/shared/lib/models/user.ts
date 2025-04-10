export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  roles?: string[];
}

export enum USER_ROLES {
  USER = "user",
  ADMIN = "admin",
  ACCOUNT_ADMIN = "account_admin",
}
