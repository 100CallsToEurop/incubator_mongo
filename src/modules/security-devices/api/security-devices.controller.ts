import { Controller, Delete, Get, HttpCode, Ip, Param, UseGuards } from '@nestjs/common';
import { DeviceViewModel } from '../application/dto/security-devices.view-model';
import { SecurityDevicesService } from '../application/security-devices.service';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get()
  async getAllSecurityDevicesUser(
    @Ip() ip: string,
  ): Promise<DeviceViewModel[]> {
    return await this.securityDevicesService.getAllDevices(ip);
  }

  @HttpCode(204)
  @Delete(':deviceId')
  async deleteSecurityDeviceUser(
    @Param('deviceId') deviceId: string,
    @Ip()
    ip: string,
  ): Promise<void> {
    await this.securityDevicesService.deleteDevice(deviceId, ip);
  }

  @HttpCode(204)
  @Delete()
  async deleteAllSecurityDevicesUser(@Ip() ip: string): Promise<void> {
    await this.securityDevicesService.deleteAllDevice(ip);
  }
}
