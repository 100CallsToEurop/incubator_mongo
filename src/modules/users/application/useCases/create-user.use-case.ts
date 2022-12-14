import { UserInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/model/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModelType } from '../../domain/interfaces/user.interface';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../domain/entity/user.entity';
import * as bcrypt from 'bcrypt';
export class CreateUserCommand {
  constructor(
    public createParam: UserInputModel,
    public isConfirmed: boolean
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

  async execute(command: CreateUserCommand): Promise<UserDocument> {
    const { createParam, isConfirmed } = command;

    await this.checkEmailOrLogin(createParam.email);
    await this.checkEmailOrLogin(createParam.login);

    createParam.password = await bcrypt.hash(createParam.password, 10);

    const newUserEntity = new UserEntity(createParam, isConfirmed);

    const newUser = this.UserModel.createUser(
      newUserEntity,
      this.UserModel,
    );

    await this.usersRepository.save(newUser);

    return newUser;
  }
}
