import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SecurityDevicesRepository } from '../../../modules/security-devices/infrastructure/security-devices.repository';

@Injectable()
export class DeleteDeviceIdGuard implements CanActivate {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const deviceId = request.params['deviceId'];
    const checkDeviceId =
      await this.securityDevicesRepository.getSecurityDevicesByDeviceId(
        deviceId,
      );

    if (!checkDeviceId) {
      throw new NotFoundException();
    }
    return true;
  }
}
