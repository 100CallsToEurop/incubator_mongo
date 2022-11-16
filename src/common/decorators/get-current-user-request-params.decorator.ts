import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceInputModel } from '../../modules/security-devices/api/models/security-devices.model';

export const GetCurrentUserRequestParams = createParamDecorator(
  (data: undefined, context: ExecutionContext): DeviceInputModel => {
    const request = context.switchToHttp().getRequest();
    return {
      ip: request.ip,
      user_agent: request.headers['user-agent'],
    };
  },
);
