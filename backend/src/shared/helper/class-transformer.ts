import { omit } from 'lodash';
import { UserEntity } from 'src/entities/user.entity';
import { UserDecodeDto } from 'src/features/account/user/dtos/user.dto';

export const userToUserDecodeDto = (user: UserEntity): UserDecodeDto => {
  let userInput = null;
  const removeUserKeys = ['deleted', 'password', 'token', 'updated', 'created'];

  const userToSend = omit(user, removeUserKeys) as any;

  userInput = {
    ...userToSend,
    fullName: user.fullName,
  };
  return userInput;
};
