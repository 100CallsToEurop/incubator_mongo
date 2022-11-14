import { Module } from '@nestjs/common';
import { ManagersModule } from '../managers/managers.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  imports: [TokensModule, UsersModule, ManagersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
