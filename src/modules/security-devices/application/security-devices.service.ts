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
import {
  SecurityDeviceInputModel,
  SecurityDeviceViewModel,
} from '../infrastructure/dto/security-devices.input-model';
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

  async updateDevice(device: SecurityDeviceInputModel): Promise<void> {
    await this.securityDevicesRepository.updateSecurityDeviceById(device);
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
      await this.securityDevicesRepository.getSecurityDevicesByDeviceId(
        deviceIdReq,
      );
    if (checkDeviceId.length === 0) {
      throw new NotFoundException();
    }

    const { userId } = await this.tokensService.decodeToken(refreshToken);

    const checkUserDeviceId =
      await this.securityDevicesRepository.getSecurityDevicesByDeviceIdAndUserId(
        deviceIdReq,
        userId,
      );

    if (checkUserDeviceId.length === 0) {
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

  async getDeviceByDevice(
    device: DeviceInputModel,
    userId: string,
  ): Promise<SecurityDeviceViewModel> {
    const deviceResponse =
      await this.securityDevicesRepository.getSecurityDeviceByDevice(
        device,
        userId,
      );
    return {
      deviceId: deviceResponse.deviceId,
      ip: deviceResponse.ip,
      user_agent: deviceResponse.user_agent,
      userId: deviceResponse.userId,
    };
  }
}
