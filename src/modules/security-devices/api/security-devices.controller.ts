import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../../../common/decorators/public.decorator';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { DeleteDeviceIdGuard } from '../../../common/guards/device/security-device-delete-id.guard';

import { DeviceViewModel } from './queryRepository/dto/security-devices.view-model';

import { SecurityDevicesQueryRepository } from './queryRepository/security-devices.query.repository';
import { CheckUserDevicesGuard } from '../../../common/guards/device/check-user-devices.guard';
import { CommandBus } from '@nestjs/cqrs';
import {
  DeleteAllUserDevicesCommand,
  DeleteDeviceCommand,
} from '../application/useCases';
@Public()
@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  @Get()
  async getAllSecurityDevicesUser(
    @Req() req: Request,
    @GetCurrentUserId() userId: string,
  ): Promise<DeviceViewModel[]> {
    const token = req.cookies.refreshToken;
    return await this.securityDevicesQueryRepository.findAllUserDevices(userId);
  }

  @UseGuards(DeleteDeviceIdGuard, CheckUserDevicesGuard)
  @HttpCode(204)
  @Delete(':deviceId')
  async deleteSecurityDeviceUser(
    @Param('deviceId') deviceId: string,
    @GetCurrentUserId() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteDeviceCommand(userId, deviceId));
  }

  @HttpCode(204)
  @Delete()
  async deleteAllSecurityDevicesUser(
    @GetCurrentUserId() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteAllUserDevicesCommand(userId));
  }
}
