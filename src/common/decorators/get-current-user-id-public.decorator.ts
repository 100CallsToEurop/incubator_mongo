import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetCurrentUserIdPublic = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if(!request.user?.userId) return null;
    return request.user.userId;
  },
);
