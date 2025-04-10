import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtDecode } from 'jwt-decode';
import { UserEntity } from '../../../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    //const token = req.header('authorization');
    const request = context.switchToHttp().getRequest();

    if (request.headers?.authorization != null) {
      const token = request.headers?.authorization;
      const user = jwtDecode<UserEntity>(token);
      return user.roles?.some((r) => roles.includes(r));
    } else {
      throw new UnauthorizedException('Unauthorized request.');
    }
  }
}
