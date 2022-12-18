import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SecurityDevicesQueryRepository } from '../../../modules/security-devices/api/queryRepository/security-devices.query.repository';

@Injectable()
export class CheckUserDevicesGuard implements CanActivate {
  constructor(
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.user["userId"]
    const checkUserDeviceId =
      await this.securityDevicesQueryRepository.getSecurityDevices(userId);
    if (checkUserDeviceId.length === 0) {
      throw new ForbiddenException();
    }
    return true;
  }
}
