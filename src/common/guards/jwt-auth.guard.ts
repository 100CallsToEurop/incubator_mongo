import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest()
    const auth = req.headers.authorization;
    const cookie = req.cookies.refreshToken;

    if (isPublic && !auth && !cookie) return true;
    return super.canActivate(context);  
  }
}
