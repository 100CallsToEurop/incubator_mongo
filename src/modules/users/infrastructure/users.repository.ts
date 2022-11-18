import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Query params
import { SortDirection } from '../../paginator/models/query-params.model';

//Models
import { GetQueryParamsUserDto, UserInputModel } from '../api/models';

//DTO
import { UserPaginatorRepository} from '../application/dto';

//Entity
import { UserEntity } from '../domain/entity/user.entity';

//Intefaces
import { IUser } from '../domain/interfaces/user.interface';

//Schema
import { User } from '../domain/model/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUsers(
    query?: GetQueryParamsUserDto,
  ): Promise<UserPaginatorRepository> {
    const whereCondition = [];

    if (query && query.searchLoginTerm) {
      whereCondition.push({
        login: new RegExp('(' + query.searchLoginTerm.toLowerCase() + ')', 'i'),
      });
    }

    if (query && query.searchEmailTerm) {
      whereCondition.push({
        email: new RegExp('(' + query.searchEmailTerm.toLowerCase() + ')', 'i'),
      });
    }

    //Filter
    let filter = this.userModel.find();
    let totalCount = (await this.userModel.find(filter).exec()).length;
    if (whereCondition.length > 0) {
      filter.or(whereCondition);
      totalCount = (await this.userModel.find(filter).exec()).length;
    }

    //Sort
    const sortDefault = 'createdAt';
    let sort = `-${sortDefault}`;
    if (query && query.sortBy && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}`)
        : (sort = `${query.sortBy}`);
    } else if (query && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${sortDefault}`)
        : (sort = sortDefault);
    } else if (query && query.sortBy) {
      sort = `-${query.sortBy}`;
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const pageSize = Number(query?.pageSize) || 10;
    const pagesCount = Math.ceil(totalCount / pageSize);
    const skip: number = (page - 1) * pageSize;

    const items = await this.userModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(pageSize)
      .exec();

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items,
    };
  }

  async getUserById(_id: Types.ObjectId): Promise<IUser> {
    return await this.userModel.findById({ _id }).exec();
  }

  async deleteUserById(_id: Types.ObjectId): Promise<boolean> {
    const deleteUser = await this.userModel.findByIdAndDelete({ _id }).exec();
    return deleteUser ? true : false;
  }

  async createUser(User: UserEntity): Promise<IUser> {
    const newUser = new this.userModel(User);
    return await newUser.save();
  }

  async updateUser(
    _id: Types.ObjectId,
    update: UserInputModel,
  ): Promise<boolean> {
    const updateUser = await this.userModel
      .findByIdAndUpdate({ _id }, update)
      .exec();
    return updateUser ? true : false;
  }

  async findUserByEmailOrLogin(emailOrLogin: string): Promise<IUser> {
    return await this.userModel
      .findOne()
      .where({
        $or: [
          { 'accountData.email': emailOrLogin },
          { 'accountData.login': emailOrLogin },
        ],
      })
      .exec();
  }

  async findByConfirmCode(code: string): Promise<IUser | null> {
    return await this.userModel
      .findOne()
      .where({
        'emailConfirmation.confirmationCode': code,
      })
      .exec();
  }

  async updateConfirmationState(_id: Types.ObjectId): Promise<IUser | null> {
    const user = await this.userModel
      .findByIdAndUpdate(
        { _id: _id },
        { 'emailConfirmation.isConfirmed': true },
        { new: true },
      )
      .exec();
    return user;
  }

  async updateConfirmationCode(
    _id: Types.ObjectId,
    code: string,
  ): Promise<IUser | null> {
    return await this.userModel
      .findByIdAndUpdate(
        { _id },
        {
          'emailConfirmation.confirmationCode': code,
        },
        { new: true },
      )
      .exec();
  }

  async updateUserPasswordHash(_id: Types.ObjectId, newHash: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(
        { _id: _id },
        { 'accountData.passwordHash': newHash },
        { new: true },
      )
      .exec();
  }

  async findByPasswordRecoveryCode(code: string): Promise<IUser | null> {
    return await this.userModel
      .findOne()
      .where({
        'passwordRecovery.passwordRecoveryCode': code,
      })
      .exec();
  }

  async updatePasswordRecoveryCode(
    _id: Types.ObjectId,
    code: string,
  ): Promise<IUser | null> {
    return await this.userModel
      .findByIdAndUpdate(
        { _id },
        {
          'passwordRecovery.passwordRecoveryCode': code,
        },
        { new: true },
      )
      .exec();
  }
}
