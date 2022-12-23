import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from 'src/modules/users/infrastructure/users.repository';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.RT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request.cookies.refreshToken;
          if (!refreshToken) {
            throw new UnauthorizedException();
          }
          return refreshToken;
        },
      ]),
      //jwtFromRequest: ExtractJwt.fromHeader('Cookie'),
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies.refreshToken;
    const checkInvalidToken = await this.usersRepository.findBadToken(
      refreshToken,
    );
    if (checkInvalidToken) {
      throw new UnauthorizedException();
    }

    delete payload.iat;
    delete payload.exp;
    return payload;
  }
}
