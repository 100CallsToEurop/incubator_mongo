import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

//Models
import { LoginInputModel } from '../api/models';

//Models -users
import { UserInputModel } from '../../../modules/users/api/models';

//Service
import { EmailTemplatesManager } from '../../../modules/managers/application/managers.service';

//Repository - users
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';
import { UserEntity } from 'src/modules/users/domain/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailManager: EmailTemplatesManager,
    private readonly usersRepository: UsersRepository,
  ) {}

  async checkCredentials(loginParam: LoginInputModel): Promise<any> {
    const user = await this.usersRepository.findUserByEmailOrLogin(
      loginParam.login,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const isHashedEquals = await this._isPasswordCorrect(
      loginParam.password,
      user.accountData.passwordHash,
    );
    if (isHashedEquals)
      return {
        userId: user._id.toString(),
        email: user.accountData.email,
        login: user.accountData.login,
      };
    throw new UnauthorizedException();
  }

  async registration(newUserModel: UserInputModel) {
    const passwordHash = await this._generateHash(newUserModel.password);
    const checkUserEmail = await this.usersRepository.findUserByEmailOrLogin(
      newUserModel.email,
    );
    const checkUserLogin = await this.usersRepository.findUserByEmailOrLogin(
      newUserModel.login,
    );
    if (checkUserEmail) {
      throw new BadRequestException({
        message: ['email already exists'],
      });
    }
    if (checkUserLogin) {
      throw new BadRequestException({
        message: ['login already exists'],
      });
    }
    const newUserEntity = new UserEntity(newUserModel, passwordHash);
    const newUser = await this.usersRepository.createUserDatabase(
      newUserEntity,
    );
    try {
      await this.emailManager.sendEmailConfirmationMessage(
        newUser.accountData.email,
        newUser.emailConfirmation.confirmationCode,
      );
      return newUser;
    } catch (err) {
      console.log(err);
      //await usersRepository.deleteUserById(newUser._id)
      throw new InternalServerErrorException();
    }
  }

  async resendingEmail(email: string) {
    const user = await this.usersRepository.findUserByEmailOrLogin(email);
    if (!user) {
      throw new BadRequestException({
        message: ['email incorrect'],
      });
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException({
        message: ['email already activated'],
      });
    }
    const newCode = (user.emailConfirmation.confirmationCode = uuidv4());
    await this.usersRepository.updateConfirmationCode(user._id, newCode);
    try {
      await this.emailManager.sendEmailConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode,
      );
      return newCode;
    } catch (err) {
      console.log(err);
      // await usersRepository.deleteUserById(user._id)
      throw new InternalServerErrorException();
    }
  }

  async findUserForConfirm(code: string) {
    const user = await this.usersRepository.findByConfirmCode(code);
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

    return await this.usersRepository.updateConfirmationState(user._id);
  }

  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async _isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
