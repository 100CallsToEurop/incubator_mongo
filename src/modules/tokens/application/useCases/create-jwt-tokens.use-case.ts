import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs/dist';
import { JwtService } from '@nestjs/jwt';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { TokensViewModel } from '../dto';

export class CreateJWTTokensCommand {
  constructor(public payload: MeViewModel, public deviceId: string) {}
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
    const { payload, deviceId } = command;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('AT_SECRET'),
        expiresIn: +this.configServie.get<string>('AT_TIME'),
      }),

      this.jwtService.signAsync(
        { ...payload, deviceId },
        {
          secret: this.configServie.get<string>('RT_SECRET'),
          expiresIn: +this.configServie.get<string>('RT_TIME'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
