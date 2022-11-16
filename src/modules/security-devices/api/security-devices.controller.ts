import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';
import { DeviceViewModel } from '../application/dto/security-devices.view-model';
import { SecurityDevicesService } from '../application/security-devices.service';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get()
  async getAllSecurityDevicesUser(
    @GetCurrentUserId() userId: string,
  ): Promise<DeviceViewModel[]> {
    return await this.securityDevicesService.getAllDevices(userId);
  }

  @HttpCode(204)
  @Delete(':deviceId')
  async deleteSecurityDeviceUser(
    @Param('deviceId', ParseObjectIdPipe) id: Types.ObjectId,
    @GetCurrentUserId()
    userId: string,
  ): Promise<void> {
    await this.securityDevicesService.deleteDevice(id, userId);
  }

  @HttpCode(204)
  @Delete()
  async deleteAllSecurityDevicesUser(
    @GetCurrentUserId() userId: string,
  ): Promise<void> {
    await this.securityDevicesService.deleteAllDevice(userId);
  }
}
