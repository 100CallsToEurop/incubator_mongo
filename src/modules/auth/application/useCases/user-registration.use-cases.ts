import { UserInputModel } from '../../../../modules/users/api/models';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { CreateUserCommand } from '../../../../modules/users/application/useCases';
export class UserRegistrationCommand {
  constructor(public newUserModel: UserInputModel) {}
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase
  implements ICommandHandler<UserRegistrationCommand>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersRepository: UsersRepository,
    private readonly authServices: AuthService,
  ) {}

  async execute(command: UserRegistrationCommand): Promise<void> {
    const { newUserModel } = command;

    const newUser = await this.commandBus.execute(
      new CreateUserCommand(newUserModel, false),
    );

    const email = newUser.getUserEmail();
    const emailMessage = newUser.getMessageCode();
    await this.usersRepository.save(newUser);
    await this.authServices.sendEmailMessage(email, emailMessage);
  }
}
