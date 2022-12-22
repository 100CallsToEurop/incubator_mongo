import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { JwtService } from '@nestjs/jwt';


export class DecodeJWTTokenCommand {
  constructor(public token: string) {}
}

@CommandHandler(DecodeJWTTokenCommand)
export class DecodeJWTTokenUseCase
  implements ICommandHandler<DecodeJWTTokenCommand>
{
  constructor(
    private readonly configServie: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: DecodeJWTTokenCommand) /*: DecodeTokenViewModel*/ {
    const { token} = command ;
    try {
      const decodeToken = this.jwtService.verify(token, {
        secret: this.configServie.get<string>('RT_SECRET'),
      });
      return decodeToken;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
