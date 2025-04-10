import * as jwt from 'jsonwebtoken';
import { UserDecodeDto } from 'src/features/account/user/dtos/user.dto';

export const createAccessToken = (user: UserDecodeDto) => {
  // status. role,
  const expiresIn = 604800;

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.firstName + ' ' + user.lastName,
      roles: user.roles ?? ['user'],
    },
    process.env.JWT_SECRET,
    { expiresIn },
  );

  return {
    expiresIn,
    accessToken,
  };
};

export const createRefreshToken = (user: UserDecodeDto) => {
  const expiresIn = 604800;

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.firstName + ' ' + user.lastName,
      roles: user.roles ?? ['user'],
    },
    process.env.JWT_SECRET,
    { expiresIn },
  );

  return {
    expiresIn,
    refreshToken,
  };
};
