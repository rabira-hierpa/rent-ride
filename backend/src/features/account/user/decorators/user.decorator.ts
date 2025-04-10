import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { UserDecodeDto } from '../dtos/user.dto';

export const User = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    try {
      if (request.headers?.authorization != null) {
        const token = request.headers?.authorization;
        return jwtDecode<UserDecodeDto>(token);
      } else {
        throw new Error('User Not Authenticated');
      }
    } catch {
      throw new UnauthorizedException();
    }
  },
);
