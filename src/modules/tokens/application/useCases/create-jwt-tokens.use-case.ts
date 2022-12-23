import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs/dist';
import { JwtService } from '@nestjs/jwt';
import { DeviceInputModel } from 'src/modules/security-devices/api/models';
import { TokensViewModel } from '../dto';

export class CreateJWTTokensCommand {
  constructor(public payload: Omit<DeviceInputModel, 'ip' | 'user_agent'>) {}
}

@CommandHandler(CreateJWTTokensCommand)
export class CreateJWTTokensUseCase
  implements ICommandHandler<CreateJWTTokensCommand>
{
  constructor(
    private readonly configServie: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: CreateJWTTokensCommand): Promise<TokensViewModel> {
    const { payload } = command;
    const { deviceId, ...user } = payload;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: this.configServie.get<string>('AT_SECRET'),
        expiresIn: +this.configServie.get<string>('AT_TIME'),
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('RT_SECRET'),
        expiresIn: +this.configServie.get<string>('RT_TIME'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
