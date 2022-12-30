import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInputModel } from '../models';
import { MeViewModel } from '../../application/dto';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { User } from '../../../../modules/users/domain/model/user.schema';

@Injectable()
export class AuthQueryRepository {
  constructor(private readonly usersRepository: UsersRepository) {}

  private buildPayloadResponseUser(user: User): MeViewModel {
    return {
      userId: user._id.toString(),
      email: user.getUserEmail(),
      login: user.getUserLogin(),
    };
  }

  private async findUserByEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const findUserEmailOrLogin =
      await this.usersRepository.findUserByEmailOrLogin(emailOrLogin);
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

  async checkCredentials(loginParam: LoginInputModel): Promise<MeViewModel> {
    const user = await this.findUserByEmailOrLogin(loginParam.loginOrEmail);
    if (await user.checkPassword(loginParam.password)) {
      return this.buildPayloadResponseUser(user);
    }
    throw new UnauthorizedException();
  }
}
