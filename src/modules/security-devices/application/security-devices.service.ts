import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { MeViewModel } from '../../../modules/auth/application/dto';
import { JwtAuthRefreshGuard } from '../../../common/guards/jwt-auth.refresh.guard';
import { TokensService } from '../../../modules/tokens/application/tokens.service';
import { DeviceInputModel } from '../api/models/security-devices.model';
import { SecurityDeviceEntity } from '../domain/entity/security-devices.entity';
import { ISecutityDevices } from '../domain/interfaces/security-devices.interface';
import { SecurityDevicesRepository } from '../infrastructure/security-devices.repository';
import { DeviceViewModel } from './dto/security-devices.view-model';
import { TokensViewModel } from '../../../modules/tokens/application/dto';
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';

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
    user: MeViewModel,
  ): Promise<TokensViewModel> {
    const tokens = await this.tokensService.createJWT(user, uuid.v4());
    const { login, email, ...payload } = await this.tokensService.decodeToken(
      tokens.refreshToken,
    );
    const newDeviceEntity = new SecurityDeviceEntity({ ...device, ...payload });
    await this.securityDevicesRepository.createSecurityDevice(newDeviceEntity);
    return tokens;
  }

  async updateDevice(
    device: DeviceInputModel,
    token: string,
  ): Promise<TokensViewModel> {
    
    const { deviceId, iat, exp, ...user } =
      await this.tokensService.decodeToken(token);

    const tokens = await this.tokensService.createJWT(user, deviceId);
    const { login, email, ...payload } = await this.tokensService.decodeToken(
      tokens.refreshToken,
    );
    await this.securityDevicesRepository.updateSecurityDeviceById({
      ...device,
      ...payload,
    });
    return tokens;
  }

  async getAllDevices(
    refreshToken?: string,
  ): Promise<DeviceViewModel[] | any[]> {
    const { deviceId, userId } = await this.tokensService.decodeToken(
      refreshToken,
    );
    const devices = await this.securityDevicesRepository.getSecurityDevices(
      userId,
    );
    if (devices.length > 0)
      return devices.map((d) => this.buildResponseDevice(d));
    return [{ deviceId }];
  }

  async deleteDevice(token: string, deviceIdReq?: string): Promise<void> {
    const { userId, deviceId } = await this.tokensService.decodeToken(token);

    deviceIdReq ? deviceIdReq : (deviceIdReq = deviceId);

    const checkUserDeviceId =
      await this.securityDevicesRepository.getSecurityDevicesByDeviceIdAndUserId(
        deviceIdReq ? deviceIdReq : deviceId,
        userId,
      );

    if (checkUserDeviceId.length === 0) {
      throw new ForbiddenException();
    }
    const result =
      await this.securityDevicesRepository.deleteSecurityDeviceById(
        deviceIdReq ? deviceIdReq : deviceId,
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
