import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: undefined, context: ExecutionContext): any => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
