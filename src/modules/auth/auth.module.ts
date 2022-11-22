import { MiddlewareConsumer, Module } from '@nestjs/common';
import { СheckLimitReqMiddleware } from '../../common/middlewares/check-limit-request.middleware';
import { ManagersModule } from '../managers/managers.module';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  imports: [
    UsersModule,
    ManagersModule,
    SecurityDevicesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
 /* configure(consumer: MiddlewareConsumer) {
    consumer.apply(СheckLimitReqMiddleware).forRoutes(AuthController);
  }*/
}
