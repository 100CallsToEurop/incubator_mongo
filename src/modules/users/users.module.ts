import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersQueryRepository } from './api/queryRepository/users.query.repository';
import { UsersController } from './api/users.controller';
import {
  CreateUserUseCase,
  DeleteUserByIdUseCase,
  UpdateConfirmationCodeUseCase,
  UpdatePassportRecoveryUseCase,
  UpdateUserByIdUseCase,
  UpdateUserPasswordUseCase,
  UpdateUserRefreshTokenUseCase,
} from './application/useCases';
import { AddBadRefreshTokenUseCase } from './application/useCases/add-bad-refresh-token.use-case';
import { UpdateConfirmationStateUseCase } from './application/useCases/update-confirmation-state.use-case';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/model/user.schema';
import { UsersRepository } from './infrastructure/users.repository';

const useCases = [
  UpdateUserByIdUseCase,
  DeleteUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserRefreshTokenUseCase,
  AddBadRefreshTokenUseCase,
  UpdateUserPasswordUseCase,
  UpdatePassportRecoveryUseCase,
  UpdateConfirmationStateUseCase,
  UpdateConfirmationCodeUseCase,
];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, ...useCases],
  exports: [...useCases, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
