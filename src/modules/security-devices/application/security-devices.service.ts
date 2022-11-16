import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthRefreshGuard } from '../../../common/guards/jwt-auth.refresh.guard';
import { TokensService } from '../../../modules/tokens/application/tokens.service';
import { DeviceInputModelPayload } from '../api/models';
import { DeviceInputModel } from '../api/models/security-devices.model';
import { SecurityDeviceEntity } from '../domain/entity/security-devices.entity';
import { ISecutityDevices } from '../domain/interfaces/security-devices.interface';
import { SecurityDeviceInputModel } from '../infrastructure/dto/security-devices.input-model';
import { SecurityDevicesRepository } from '../infrastructure/security-devices.repository';
import { DeviceViewModel } from './dto/security-devices.view-model';

@UseGuards(JwtAuthRefreshGuard)
@Injectable()
export class SecurityDevicesService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  buildResponseDevice(device: ISecutityDevices): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.user_agent,
      lastActiveDate: new Date(+device.iat * 1000).toISOString(),
      deviceId: device.deviceId,
    };
  }

  async createDevice(
    device: DeviceInputModel,
    payload: DeviceInputModelPayload,
    userId: string,
  ): Promise<void> {
    const newDeviceEntity = new SecurityDeviceEntity(device, payload, userId);
    await this.securityDevicesRepository.createSecurityDevice(newDeviceEntity);
  }

  async updateDevice(
    deviceId: string,
    device: SecurityDeviceInputModel,
  ): Promise<void> {
    await this.securityDevicesRepository.updateSecurityDeviceById(
      deviceId,
      device,
    );
  }

  async getAllDevices(refreshToken?: string): Promise<DeviceViewModel[] | any> {
    const { deviceId, userId } = await this.tokensService.decodeToken(
      refreshToken,
    );
    const devices = await this.securityDevicesRepository.getSecurityDevices(
      userId,
    );
    if (devices.length > 0)
      return devices.map((d) => this.buildResponseDevice(d));
    return {
      deviceId,
    };
  }

  async deleteDevice(
    deviceIdReq: string,
    refreshToken?: string,
  ): Promise<void> {
    const checkDeviceId =
      await this.securityDevicesRepository.deleteAllSecurityDeviceByDeviceId(
        deviceIdReq,
      );
    if (!checkDeviceId) {
      throw new NotFoundException();
    }

    const { deviceId, userId } = await this.tokensService.decodeToken(
      refreshToken,
    );

    if (deviceIdReq !== deviceId) {
      throw new ForbiddenException();
    }
    const result =
      await this.securityDevicesRepository.deleteSecurityDeviceById(
        deviceIdReq,
        userId,
      );
    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteAllDevice(refreshToken?: string): Promise<void> {
    const { userId } = await this.tokensService.decodeToken(refreshToken);
    await this.securityDevicesRepository.deleteAllSecurityDeviceById(userId);
  }
}
