import { BadRequestException } from '@nestjs/common';
import { UserInputModel } from '../../../../modules/users/api/models';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UserModelType } from '../../../../modules/users/domain/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../../modules/users/domain/model/user.schema';
import { UserEntity } from '../../../../modules/users/domain/entity/user.entity';

export class UserRegistrationCommand {
  constructor(public newUserModel: UserInputModel) {}
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase
  implements ICommandHandler<UserRegistrationCommand>
{
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: UserModelType,
    private readonly usersRepository: UsersRepository,
    private readonly authServices: AuthService,
  ) {}

  private async checkEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const checkUserEmailOrLogin =
      await this.usersRepository.findUserByEmailOrLogin(emailOrLogin);
    if (checkUserEmailOrLogin) {
      throw new BadRequestException({
        message: [`${field} already exists`],
      });
    }
  }

  async execute(command: UserRegistrationCommand): Promise<void> {
    const { newUserModel } = command;
    await this.checkEmailOrLogin(newUserModel.email);
    await this.checkEmailOrLogin(newUserModel.login);

     const newUserEntity = new UserEntity(newUserModel, true);

    const newUser = this.UserModel.createUser(
      newUserEntity,
      this.UserModel,
    );

    await this.usersRepository.save(newUser);
    const email = newUser.getUserEmail();
    const emailMessage = newUser.getMessageCode();

    await this.authServices.sendEmailMessage(email, emailMessage);
  }
}
