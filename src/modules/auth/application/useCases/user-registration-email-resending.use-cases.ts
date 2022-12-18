import { BadRequestException} from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth.service';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/users.query.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UpdateConfirmationCodeCommand } from '../../../../modules/users/application/useCases';

export class UserRegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(UserRegistrationEmailResendingCommand)
export class UserRegistrationEmailResendingUseCase
  implements ICommandHandler<UserRegistrationEmailResendingCommand>
{
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: UserRegistrationEmailResendingCommand) {
    const {email} = command
    const user = await this.checkEmailOrLogin(email);
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException({
        message: ['email already activated'],
      });
    }
    const newCode = (user.emailConfirmation.confirmationCode = uuid.v4());
    await this.commandBus.execute(
      new UpdateConfirmationCodeCommand(user._id.toString(), newCode),
    );

    const code = user.emailConfirmation.confirmationCode;
    const link = `Thank for your registration. 
    To finish registration please follow the link below: 
    <a href="https://somesite.com/confirm-email?code=${code}">
    complete registration</a>"`;

    await this.authService.sendEmailMessage(user.accountData.email, link);

    return newCode;
  }

  private async checkEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const checkUserEmailOrLogin =
      await this.usersQueryRepository.findUserByEmailOrLogin(emailOrLogin);
    if (!checkUserEmailOrLogin && field === 'email') {
      throw new BadRequestException({
        message: ['email incorrect'],
      });
    }
    return checkUserEmailOrLogin;
  }
}
