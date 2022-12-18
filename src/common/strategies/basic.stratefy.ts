import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(login: string, password: string): Promise<boolean> {
    if (
      login == process.env.SA_LOGIN &&
      password == process.env.SA_PASSWORD
    ) {
      return true;
    }
    throw new UnauthorizedException()
  }
}
