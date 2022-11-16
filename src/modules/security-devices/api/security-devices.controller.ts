import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';
import { DeviceViewModel } from '../application/dto/security-devices.view-model';
import { SecurityDevicesService } from '../application/security-devices.service';
import { GetCurrentUserIp } from '../../../common/decorators/get-current-user-ip.decorator';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get()
  async getAllSecurityDevicesUser(
    @GetCurrentUserIp() ip: string,
  ): Promise<DeviceViewModel[]> {
    return await this.securityDevicesService.getAllDevices(ip);
  }

  @HttpCode(204)
  @Delete(':deviceId')
  async deleteSecurityDeviceUser(
    @Param('deviceId', ParseObjectIdPipe) id: Types.ObjectId,
    @GetCurrentUserIp()
    ip: string,
  ): Promise<void> {
    await this.securityDevicesService.deleteDevice(id, ip);
  }

  @HttpCode(204)
  @Delete()
  async deleteAllSecurityDevicesUser(
    @GetCurrentUserIp() ip: string,
  ): Promise<void> {
    await this.securityDevicesService.deleteAllDevice(ip);
  }
}
