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
import { UsersQueryRepository } from '../../../modules/users/api/queryRepository/users.query.repository';
import { DecodeJWTTokenCommand } from 'src/modules/tokens/application/useCases';

@Public()
@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  @Get()
  async getAllSecurityDevicesUser(
    @Req() req: Request,

  ): Promise<DeviceViewModel[] | any[]> {
    const refreshToken = req.cookies.refreshToken;
    const { deviceId, userId } = await this.commandBus.execute(
      new DecodeJWTTokenCommand(refreshToken),
    );
    const userDevices =  await this.securityDevicesQueryRepository.findAllUserDevices(userId);
    if(userDevices.length === 0){
      return [{ deviceId }];
    }
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
