import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInputModel } from '../models';
import { MeViewModel } from '../../application/dto';
import * as bcrypt from 'bcrypt';
import { IUser } from '../../../users/domain/interfaces/user.interface';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/users.query.repository';

@Injectable()
export class AuthQueryRepository {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  buildUserPayload(user: IUser): MeViewModel {
    return {
      userId: user._id.toString(),
      email: user.accountData.email,
      login: user.accountData.login,
    };
  }

  private async findUserByEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const findUserEmailOrLogin =
      await this.usersQueryRepository.findUserByEmailOrLogin(emailOrLogin);
    if (!findUserEmailOrLogin && field === 'email') {
      throw new BadRequestException({
        message: ['email incorrect'],
      });
    }

    if (!findUserEmailOrLogin && field === 'login') {
      throw new UnauthorizedException();
    }
    return findUserEmailOrLogin;
  }

  private async isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }

  async checkJWTToken(refreshToken: string): Promise<void> {
    const getUserByInvalidToken = await this.usersQueryRepository.findBadToken(
      refreshToken,
    );

    if (getUserByInvalidToken) {
      throw new UnauthorizedException();
    }
  }

  async checkCredentials(loginParam: LoginInputModel): Promise<MeViewModel> {
    const user = await this.findUserByEmailOrLogin(loginParam.loginOrEmail);
    const isHashedEquals = await this.isPasswordCorrect(
      loginParam.password,
      user.accountData.passwordHash,
    );
    if (isHashedEquals) {
      return this.buildUserPayload(user);
    }
    throw new UnauthorizedException();
  }
}
