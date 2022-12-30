import { Module, Session } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersQueryRepository } from './api/queryRepository/users.query.repository';
import { UsersController } from './api/users.controller';
import {
  BanUserUseCase,
  CreateUserUseCase,
  DeleteUserByIdUseCase,
} from './application/useCases';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/model/user.schema';
import { UsersRepository } from './infrastructure/users.repository';
import { SaController } from './api/sa.controller';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';
import { CommentsModule } from '../comments/comments.module';
import { PostsModule } from '../posts/posts.module';

const useCases = [DeleteUserByIdUseCase, CreateUserUseCase, BanUserUseCase];
@Module({
  imports: [
    CqrsModule,
    PostsModule,
    CommentsModule,
    SecurityDevicesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, SaController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, ...useCases],
  exports: [...useCases, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
