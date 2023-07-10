import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../utils';
import { Role } from '../../types/User';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    //check no user para ver se há a role necessária.

    const roleFound = requiredRoles.find((role) => role === user.role);

    if (roleFound) {
      return true;
    } else {
      throw new UnauthorizedException("User don't have enough permissions.");
    }

    return true;
  }
}
