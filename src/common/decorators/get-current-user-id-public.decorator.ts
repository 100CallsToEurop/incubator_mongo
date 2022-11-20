import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const GetCurrentUserIdPublic = createParamDecorator(
  (data: undefined, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    try {
       return request.user['userId'];
    } catch (error) {
       return null
    }
  },
);
