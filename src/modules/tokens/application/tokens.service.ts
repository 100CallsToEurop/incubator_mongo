import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';


//DTO - users
import { MeViewModel } from '../../../modules/auth/application/dto';

//Repository - users
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';

//DTO
import { DecodeTokenViewModel, TokensViewModel } from './dto';

//DTO
import { IPayload } from './interfaces/payload.interface';

@Injectable()
export class TokensService {
  constructor(
    private readonly configServie: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createJWT(payload: IPayload): Promise<TokensViewModel> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('AT_SECRET'),
        expiresIn: 10,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('RT_SECRET'),
        expiresIn: 20,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  decodeToken(token: string) /*: DecodeTokenViewModel*/ {
    try {
      const decodeToken = this.jwtService.verify(token, {
        secret: this.configServie.get<string>('RT_SECRET'),
      });
      return decodeToken;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async setRefreshTokenUser(userId: Types.ObjectId, token: string) {
    await this.usersRepository.updateRefreshToken(userId, token);
  }

  async getUserIdByToken(token: string): Promise<MeViewModel | null> {
    const user = await this.usersRepository.findUserByRefreshToken(token);
    if (user) {
      return {
        userId: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
      };
    }
    throw new UnauthorizedException();
  }

  async createInvalidToken(token: string): Promise<boolean> {
    const user = await this.getUserIdByToken(token);
    if (user) {
      await this.usersRepository.addInBadToken(token);
      return true;
    }
    return false;
  }
}
