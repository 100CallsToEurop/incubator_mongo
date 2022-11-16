import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityDevicesController } from './api/security-devices.controller';
import { SecurityDevicesService } from './application/security-devices.service';
import {
  SecurityDevice,
  SecutityDeviceSchema,
} from './domain/model/security-devices.schema';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecurityDevice.name, schema: SecutityDeviceSchema },
    ]),
  ],
  controllers: [SecurityDevicesController],
  providers: [SecurityDevicesService, SecurityDevicesRepository],
  exports: [SecurityDevicesService],
})
export class SecurityDevicesModule {}
