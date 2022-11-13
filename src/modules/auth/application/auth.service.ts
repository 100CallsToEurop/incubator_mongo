import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
//import * as bcrypt from 'bcrypt';
import bcrypt from 'bcrypt';

//Services
import { UsersService } from '../../../modules/users/application/users.service';

//Models
import { LoginInputModel } from '../api/models';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async checkCredentials(loginParam: LoginInputModel): Promise<any> {
    const user = await this.usersService.findUserByEmailOrLogin(
      loginParam.login,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const isHashedEquals = await this._isPasswordCorrect(
      loginParam.password,
      user.passwordHash,
    );
    if (isHashedEquals)
      return {
        userId: user._id.toString(),
        email: user.email,
        login: user.login,
      };
    throw new UnauthorizedException();
  }

  async _isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
