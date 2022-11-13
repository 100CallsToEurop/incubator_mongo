import { Module } from '@nestjs/common';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  imports: [TokensModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
