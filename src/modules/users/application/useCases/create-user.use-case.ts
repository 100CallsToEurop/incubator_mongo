import { UserInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/model/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserModelType } from '../../domain/interfaces/user.interface';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export class CreateUserCommand {
  constructor(
    public createParam: UserInputModel
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: UserModelType,
    private readonly usersRepository: UsersRepository,
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

  async execute(command: CreateUserCommand): Promise<string> {
    const { createParam } = command;

    await this.checkEmailOrLogin(createParam.email);
    await this.checkEmailOrLogin(createParam.login);

    const newUser = this.UserModel.createUser(
      createParam,
      true,
      this.UserModel,
    );

    await this.usersRepository.save(newUser);

    return newUser._id.toString();
  }
}
