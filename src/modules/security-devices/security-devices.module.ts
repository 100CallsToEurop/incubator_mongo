import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityDevicesQueryRepository } from './api/queryRepository/security-devices.query.repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { SecurityDevicesService } from './application/security-devices.service';
import {
  DeleteAllUserDevicesUseCase,
  DeleteDeviceUseCase,
  UpdateDeviceUseCase,
} from './application/useCases';
import {
  SecurityDevice,
  SecutityDeviceSchema,
} from './domain/model/security-devices.schema';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';

const useCases = [
  UpdateDeviceUseCase,
  DeleteDeviceUseCase,
  DeleteAllUserDevicesUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: SecurityDevice.name, schema: SecutityDeviceSchema },
    ]),
  ],
  controllers: [SecurityDevicesController],
  providers: [
    SecurityDevicesService,
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
    ...useCases,
  ],
  exports: [...useCases, SecurityDevicesQueryRepository],
})
export class SecurityDevicesModule {}
