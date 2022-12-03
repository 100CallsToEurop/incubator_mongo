import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

//Models
import { GetQueryParamsUserDto, UserInputModel } from '../api/models';

//Entity
import { UserEntity } from '../domain/entity/user.entity';

//Repository
import { UsersRepository } from '../infrastructure/users.repository';

//DTO
import { UserPaginator, UserViewModel } from './dto';

//Interfaces
import { IUser } from '../domain/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  buildResponseUser(user: IUser): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt.toISOString(),
      banInfo: {
        banDate: user.accountData.banInfo.banDate,
        banReason: user.accountData.banInfo.banReason,
        isBanned: user.accountData.banInfo.isBanned
      },
    };
  }

  async createUser(
    createParam: UserInputModel,
    isConfirmed?: boolean,
  ): Promise<UserViewModel> {
    const passwordHash = await this._generateHash(createParam.password);
    const newUserEntity = new UserEntity(
      createParam,
      passwordHash,
      isConfirmed,
    );
    const newUser = await this.usersRepository.createUser(newUserEntity);
    return this.buildResponseUser(newUser);
  }

  async updateUserById(
    id: Types.ObjectId,
    updateParam: UserInputModel,
  ): Promise<boolean> {
    const User = await this.getUserById(id);
    if (!User) {
      throw new NotFoundException();
    }
    return await this.usersRepository.updateUser(id, updateParam);
  }

  async getUsers(query?: GetQueryParamsUserDto): Promise<UserPaginator> {
    const users = await this.usersRepository.getUsers(query);
    return {
      ...users,
      items: users.items.map((item) => this.buildResponseUser(item)),
    };
  }

  async getUserById(id: Types.ObjectId): Promise<UserViewModel> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return this.buildResponseUser(user);
  }

  async deleteUserById(id: Types.ObjectId): Promise<boolean> {
    const result = await this.usersRepository.deleteUserById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  /*async findUserByEmailOrLogin(emailOrLogin: string): Promise<IUser> {
    return await this.usersRepository.findUserByEmailOrLogin(emailOrLogin);
  }*/

  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async _isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
