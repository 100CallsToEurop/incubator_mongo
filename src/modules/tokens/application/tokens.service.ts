import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

//DTO
import { TokensViewModel } from './dto';

//DTO
import { IPayload } from './interfaces/payload.interface';

@Injectable()
export class TokensService {
  constructor(
    private readonly configServie: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createJWT(
    payload: IPayload,
    deviceId: string,
  ): Promise<TokensViewModel> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('AT_SECRET'),
        expiresIn: 4000,
      }),

      this.jwtService.signAsync(
        { ...payload, deviceId },
        {
          secret: this.configServie.get<string>('RT_SECRET'),
          expiresIn: 4000,
        },
      ),
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

  decodeTokenPublic(token: string) /*: DecodeTokenViewModel*/ {
    try {
      const decodeToken = this.jwtService.verify(token, {
        secret: this.configServie.get<string>('RT_SECRET'),
      });
      return decodeToken;
    } catch (err) {
      return { userId: null };
    }
  }
}
