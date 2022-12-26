import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode } from 'jsonwebtoken';

export const GetCurrentUserIdPublic = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization!) return null;
    const accessToken = request.headers.authorization.replace('Bearer ', '');

    const decodeToken = decode(accessToken, { complete: true });
    if (decodeToken.payload['exp'] >= (new Date().getTime())/1000) {
      return decodeToken.payload['userId'];
    }
    return null;
    //console.log(decodeToken);
    // if (!request.user?.userId) return null;
    // return request.user.userId;
  },
);
