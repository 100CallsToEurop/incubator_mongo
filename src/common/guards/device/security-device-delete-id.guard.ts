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
export class DeleteDeviceIdGuard implements CanActivate {
  constructor(
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const deviceId = request.params['deviceId'];
    const checkDeviceId =
      await this.securityDevicesQueryRepository.getSecurityDevicesByDeviceId(
        deviceId,
      );

    if (!checkDeviceId) {
      throw new NotFoundException();
    }
    return true;
  }
}
