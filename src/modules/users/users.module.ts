import { Module, Session } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersQueryRepository } from './api/queryRepository/users.query.repository';
import { UsersController } from './api/users.controller';
import {
  CreateUserUseCase,
  DeleteUserByIdUseCase,
} from './application/useCases';
import { UsersService } from './application/users.service';
import { SessionSchema, UserAccount, UserAccountSchema, UserEmailConfirmation, UserEmailConfirmationSchema, UserPasswordRecovery, UserPasswordRecoverySchema } from './domain/model';
import { User, UserSchema } from './domain/model/user.schema';
import { UsersRepository } from './infrastructure/users.repository';

const useCases = [
  DeleteUserByIdUseCase,
  CreateUserUseCase
];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    /*/  { name: UserAccount.name, schema: UserAccountSchema },
      { name: UserEmailConfirmation.name, schema: UserEmailConfirmationSchema },
      { name: UserPasswordRecovery.name, schema: UserPasswordRecoverySchema },
      { name: Session.name, schema: SessionSchema },*/
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, ...useCases],
  exports: [...useCases, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
