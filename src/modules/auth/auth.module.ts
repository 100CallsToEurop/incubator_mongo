import { MiddlewareConsumer, Module, Session } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { СheckLimitReqMiddleware } from '../../common/middlewares/check-limit-request.middleware';
import { ManagersModule } from '../managers/managers.module';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthQueryRepository } from './api/queryRepository/auth.query.repository';
import { AuthService } from './application/auth.service';
import {
  PasswordNewUseCase,
  PasswordRecoveryUseCase,
  UserLoginUseCase,
  UserLogoutUseCase,
  UserRegistrationConfirmationUseCase,
  UserRegistrationEmailResendingUseCase,
  UserRegistrationUseCase,
} from './application/useCases';

const useCases = [
  PasswordNewUseCase,
  PasswordRecoveryUseCase,
  UserLoginUseCase,
  UserLogoutUseCase,
  UserRegistrationConfirmationUseCase,
  UserRegistrationEmailResendingUseCase,
  UserRegistrationUseCase,
];
@Module({
  imports: [
    CqrsModule,
    UsersModule,
    ManagersModule,
    SecurityDevicesModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...useCases, AuthQueryRepository],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(СheckLimitReqMiddleware).forRoutes(AuthController);
  // }
}
