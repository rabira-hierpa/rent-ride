import { AuthUser, User, USER_ROLES } from "../models";

export function castUserToAuthUser(
  user: User,
  exp: number,
  iat?: number
): AuthUser {
  return {
    id: user?.id,
    email: user?.email,
    firstName: user?.firstName || user?.firstName,
    lastName: user?.lastName || user?.lastName,
    fullName: user?.fullName,
    roles: user?.roles as USER_ROLES[],
    exp: exp,
    iat: iat,
  };
}
