import { BadRequestException } from '@nestjs/common';
import { UserInputModel } from '../../../../modules/users/api/models';
import { UserEntity } from '../../../../modules/users/domain/entity/user.entity';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/users.query.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';

export class UserRegistrationCommand {
  constructor(public newUserModel: UserInputModel) {}
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase
  implements ICommandHandler<UserRegistrationCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authServices: AuthService,
  ) {}

  private async generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async execute(command: UserRegistrationCommand) {
    const { newUserModel } = command;
    await this.checkEmailOrLogin(newUserModel.email);
    await this.checkEmailOrLogin(newUserModel.login);

    const passwordHash = await this.generateHash(newUserModel.password);
    const newUserEntity = new UserEntity(newUserModel, passwordHash);
    const newUserId = await this.usersRepository.createUser(newUserEntity);
    const newUser = await this.usersQueryRepository.getUserByIdFull(newUserId);

    const link = `To verify your email, go to 
 <a href="https://somesite.com/confirm-email?code=${newUser.emailConfirmation.confirmationCode}">
 there</a>"`;

    await this.authServices.sendEmailMessage(newUser.accountData.email, link);
    return newUser;
  }

  private async checkEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const checkUserEmailOrLogin =
      await this.usersQueryRepository.findUserByEmailOrLogin(emailOrLogin);
    if (checkUserEmailOrLogin) {
      throw new BadRequestException({
        message: [`${field} already exists`],
      });
    }
  }
}
