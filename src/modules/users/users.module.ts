import { Module} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersQueryRepository } from './api/queryRepository/users.query.repository';
import { UsersController } from './api/users.controller';
import {
  BanUserBlogUseCase,
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
import { Blog, BlogSchema } from '../blogs/domain/model/blog.schema';
import { BloggerUserController } from './api/blogger-user.controller';

const useCases = [
  DeleteUserByIdUseCase,
  CreateUserUseCase,
  BanUserUseCase,
  BanUserBlogUseCase,
];
@Module({
  imports: [
    CqrsModule,
    PostsModule,
    CommentsModule,
    SecurityDevicesModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [UsersController, SaController, BloggerUserController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, ...useCases],
  exports: [...useCases, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
