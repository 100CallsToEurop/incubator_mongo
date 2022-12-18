import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './application/tokens.service';
import {
  CreateJWTTokensUseCase,
  DecodeJWTTokenUseCase,
} from './application/useCases';

const useCases = [CreateJWTTokensUseCase, DecodeJWTTokenUseCase];

@Module({
  imports: [CqrsModule, JwtModule],
  providers: [TokensService, ...useCases],
  exports: [...useCases],
})
export class TokensModule {}
