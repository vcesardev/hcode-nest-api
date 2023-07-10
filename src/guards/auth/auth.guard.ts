import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    try {
      const data = this.authService.checkToken(
        (authorization || '').split(' ')[1],
      );

      request.tokenPayload = data;

      request.user = await this.userService.findById(Number(data.sub));

      return true;
    } catch (err) {
      return false;
    }
  }
}
