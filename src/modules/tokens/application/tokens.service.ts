import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

//DTO - auth
import { LoginSuccessViewModel } from '../../../modules/auth/application/dto';

//DTO
import { IPayload } from './interfaces/payload.interface';

@Injectable()
export class TokensService {
  constructor(
    private readonly configServie: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createJWT(payload: IPayload): Promise<LoginSuccessViewModel> {
    const [access_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('AT_SECRET'),
        expiresIn: 2000,
      }),
    ]);

    return {
      accessToken: access_token,
    };
  }
}
