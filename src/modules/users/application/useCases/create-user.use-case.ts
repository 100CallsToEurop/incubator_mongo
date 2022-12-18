import * as bcrypt from 'bcrypt';
import { UserInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserEntity } from '../../domain/entity/user.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateUserCommand {
  constructor(
    public createParam: UserInputModel,
    public isConfirmed?: boolean,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  private async generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async execute(command: CreateUserCommand): Promise<string> {
    const { createParam, isConfirmed } = command;
    const passwordHash = await this.generateHash(createParam.password);

    const newUserEntity = new UserEntity(
      createParam,
      passwordHash,
      isConfirmed,
    );
    const newUser = await this.usersRepository.createUser(newUserEntity);
    return newUser;
  }
}
