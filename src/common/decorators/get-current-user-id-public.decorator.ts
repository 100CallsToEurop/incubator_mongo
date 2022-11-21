import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetCurrentUserIdPublic = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    try {
      return request.user['userId'];
    } catch (error) {
      return {
        userId: null,
      };
    }
  },
);
