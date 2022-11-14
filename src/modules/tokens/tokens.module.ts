import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TokensService } from './application/tokens.service';

@Module({
  imports: [JwtModule, UsersModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
