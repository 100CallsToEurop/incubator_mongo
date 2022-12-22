import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';

export class UserRegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(UserRegistrationConfirmationCommand)
export class UserRegistrationConfirmationUseCase
  implements ICommandHandler<UserRegistrationConfirmationCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UserRegistrationConfirmationCommand): Promise<void> {
    const { code } = command;
    const user = await this.usersRepository.findByConfirmCode(code);
    if (!user || user.checkConfirmed(code)) {
      throw new BadRequestException({
        message: ['code invalid'],
      });
    }
    await this.usersRepository.save(user);
  }
}
