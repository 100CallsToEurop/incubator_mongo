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

  async createUser(createParam: UserInputModel): Promise<UserViewModel> {
    const passwordHash = await this._generateHash(createParam.password);
    const newUser = new UserEntity(createParam, passwordHash);
    return await this.usersRepository.createUser(newUser);
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
    return await this.usersRepository.getUsers(query);
  }

  async getUserById(id: Types.ObjectId): Promise<UserViewModel> {
    const User = await this.usersRepository.getUserById(id);
    if (!User) {
      throw new NotFoundException();
    }
    return User;
  }

  async deleteUserById(id: Types.ObjectId): Promise<boolean> {
    const result = await this.usersRepository.deleteUserById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async findUserByEmailOrLogin(emailOrLogin: string): Promise<IUser> {
    return await this.usersRepository.findUserByEmailOrLogin(emailOrLogin);
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
