import { BadRequestException } from '@nestjs/common';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/users.query.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UpdateConfirmationStateCommand } from '../../../../modules/users/application/useCases';

export class UserRegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(UserRegistrationConfirmationCommand)
export class UserRegistrationConfirmationUseCase
  implements ICommandHandler<UserRegistrationConfirmationCommand>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: UserRegistrationConfirmationCommand) {
    const {code} = command
    const user = await this.usersQueryRepository.findByConfirmCode(code);
    if (!user) {
      throw new BadRequestException({
        message: ['code invalid'],
      });
    }
    if (
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.confirmationCode !== code ||
      user.emailConfirmation.expirationDate < new Date()
    ) {
      throw new BadRequestException({
        message: ['code invalid'],
      });
    }
    await this.commandBus.execute(
      new UpdateConfirmationStateCommand(user._id.toString()),
    );
  }
}
