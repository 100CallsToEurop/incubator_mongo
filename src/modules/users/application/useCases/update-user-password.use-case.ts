import { UsersRepository } from '../../infrastructure/users.repository';
import * as bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';

export class UpdateUserPasswordCommand {
  constructor(public userId: string, public newPassword: string) {}
}

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordUseCase
  implements ICommandHandler<UpdateUserPasswordCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  private async generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async execute(command: UpdateUserPasswordCommand): Promise<void> {
    const { userId, newPassword } = command;
    const passwordHash = await this.generateHash(newPassword);
    await this.usersRepository.updateUserPasswordHash(userId, passwordHash);
  }
}
