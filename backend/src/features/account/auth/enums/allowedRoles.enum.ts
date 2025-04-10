export enum AllowedRoles {
  // Normal user
  USER = 'user',
  // Super user
  ADMIN = 'admin',
}

export const AllowedRolesArray: string[] = Object.keys(AllowedRoles).map(
  (key) => AllowedRoles[key],
);
