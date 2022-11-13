import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
//Services
import { UsersService } from '../../../modules/users/application/users.service';

//Models
import { LoginInputModel } from '../api/models';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async checkCredentials(loginParam: LoginInputModel) {
    const user = await this.usersService.findUserByEmailOrLogin(
      loginParam.login,
    );
    if (!user) {
      throw new BadRequestException({ message: ['login not found'] });
    }
    const isHashedEquals = await this._isPasswordCorrect(
      loginParam.password,
      user.passwordHash,
    );
    if (isHashedEquals)
      return;
    throw new UnauthorizedException();
  }

  async _isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
