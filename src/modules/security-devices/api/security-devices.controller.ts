import { Controller, Delete, Get, HttpCode, Param, Req} from '@nestjs/common';
import { DeviceViewModel } from '../application/dto/security-devices.view-model';
import { SecurityDevicesService } from '../application/security-devices.service';
import { Request} from 'express';
import { GetCurrentUserRequestParams } from '../../../common/decorators/get-current-user-request-params.decorator';
import { DeviceInputModel } from './models';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get()
  async getAllSecurityDevicesUser(
    @Req() req: Request,
  ): Promise<DeviceViewModel[]> {
    const token = req.cookies.refreshToken;
    return await this.securityDevicesService.getAllDevices(token);
  }

  @HttpCode(204)
  @Delete(':deviceId')
  async deleteSecurityDeviceUser(
    @Param('deviceId') deviceId: string,
    @Req() req: Request,
  ): Promise<void> {
    const token = req.cookies.refreshToken;
    await this.securityDevicesService.deleteDevice(deviceId, token);
  }

  @HttpCode(204)
  @Delete()
  async deleteAllSecurityDevicesUser(
    @Req() req: Request
  ): Promise<void> {
    const token = req.cookies.refreshToken;
    await this.securityDevicesService.deleteAllDevice(token);
  }
}
