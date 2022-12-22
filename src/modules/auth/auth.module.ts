import { MiddlewareConsumer, Module, Session } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { СheckLimitReqMiddleware } from '../../common/middlewares/check-limit-request.middleware';
import { ManagersModule } from '../managers/managers.module';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';
import { TokensModule } from '../tokens/tokens.module';
import { SessionSchema, UserAccount, UserAccountSchema, UserEmailConfirmation, UserEmailConfirmationSchema, UserPasswordRecovery, UserPasswordRecoverySchema } from '../users/domain/model';
import { User, UserSchema } from '../users/domain/model/user.schema';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthQueryRepository } from './api/queryRepository/auth.query.repository';
import { AuthService } from './application/auth.service';
import {
  PasswordNewUseCase,
  PasswordRecoveryUseCase,
  RefreshTokensUseCase,
  UserLoginUseCase,
  UserLogoutUseCase,
  UserRegistrationConfirmationUseCase,
  UserRegistrationEmailResendingUseCase,
  UserRegistrationUseCase,
} from './application/useCases';

const useCases = [
  PasswordNewUseCase,
  PasswordRecoveryUseCase,
  RefreshTokensUseCase,
  UserLoginUseCase,
  UserLogoutUseCase,
  UserRegistrationConfirmationUseCase,
  UserRegistrationEmailResendingUseCase,
  UserRegistrationUseCase,
];
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAccount.name, schema: UserAccountSchema },
      { name: UserEmailConfirmation.name, schema: UserEmailConfirmationSchema },
      { name: UserPasswordRecovery.name, schema: UserPasswordRecoverySchema },
      { name: Session.name, schema: SessionSchema },
    ]),
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(СheckLimitReqMiddleware).forRoutes(AuthController);
  }
}
