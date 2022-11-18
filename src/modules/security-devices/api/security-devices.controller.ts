import { Controller, Delete, Get, HttpCode, Param, Req, UseGuards} from '@nestjs/common';
import { Request} from 'express';
import { DeleteDeviceIdGuard } from '../../../common/guards/device/security-device-delete-id.guard';
import { JwtAuthRefreshGuard } from '../../../common/guards/jwt-auth.refresh.guard';

import { DeviceViewModel } from '../application/dto/security-devices.view-model';
import { SecurityDevicesService } from '../application/security-devices.service';

@UseGuards(JwtAuthRefreshGuard)
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

  @UseGuards(DeleteDeviceIdGuard)
  @HttpCode(204)
  @Delete(':deviceId')
  async deleteSecurityDeviceUser(
    @Param('deviceId') deviceId: string,
    @Req() req: Request,
  ): Promise<void> {
    const token = req.cookies.refreshToken;
    await this.securityDevicesService.deleteDevice(token, deviceId);
  }

  @HttpCode(204)
  @Delete()
  async deleteAllSecurityDevicesUser(@Req() req: Request): Promise<void> {
    const token = req.cookies.refreshToken;
    await this.securityDevicesService.deleteAllDevice(token);
  }
}
