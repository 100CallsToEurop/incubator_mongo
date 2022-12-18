import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Paginated } from '../../../../modules/paginator/models/paginator';
import { SortDirection } from '../../../../modules/paginator/models/query-params.model';
import { UserViewModel } from './dto';
import { IUser } from '../../domain/interfaces/user.interface';
import { User } from '../../domain/model/user.schema';

import { GetQueryParamsUserDto } from '../models';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private buildResponseUser(user: IUser): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt.toISOString(),
    };
  }

  private createRegExp(value: string): RegExp {
    return new RegExp('(' + value.toLowerCase() + ')', 'i');
  }
  async getUserById(userId: string): Promise<UserViewModel> {
    const user = await this.userModel.findById({
      _id: new Types.ObjectId(userId),
    });
    return this.buildResponseUser(user);
  }

  async getUserByIdFull(userId: string): Promise<IUser> {
    const user = await this.userModel.findById({
      _id: new Types.ObjectId(userId),
    });
    return user
  }

  async getUsers(
    query?: GetQueryParamsUserDto,
  ): Promise<Paginated<UserViewModel[]>> {
    //Sort
    const sortDefault = 'accountData.createdAt';
    let sort = `-${sortDefault}`;
    const { sortBy, sortDirection } = query;
    if (query && query.sortBy && query.sortDirection) {
      sortDirection === SortDirection.DESC
        ? (sort = `-accountData.${sortBy}`)
        : (sort = `accountData.${sortBy}`);
    } else if (query && sortDirection) {
      sortDirection === SortDirection.DESC
        ? (sort = `-${sortDefault}`)
        : (sort = sortDefault);
    } else if (query && sortBy) {
      sort = `-accountData.${sortBy}`;
    }

    const whereCondition = [];

    if (query && query.searchLoginTerm) {
      whereCondition.push({
        'accountData.login': this.createRegExp(query.searchLoginTerm),
      });
    }

    if (query && query.searchEmailTerm) {
      whereCondition.push({
        'accountData.email': this.createRegExp(query.searchEmailTerm),
      });
    }

    // filter['$or'] = [
    //   { 'accountData.email': this.createRegExp(query.searchLoginTerm) },
    //   { 'accountData.login': this.createRegExp(query.searchEmailTerm) },
    // ];

    //Filter
    let filter = this.userModel.find();
    if (whereCondition.length > 0) {
      filter.or(whereCondition);
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountUsers = await this.userModel.count(filter);

    const users = await this.userModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedUsers = Paginated.getPaginated<UserViewModel[]>({
      items: users.map((user) => this.buildResponseUser(user)),
      page: page,
      size: size,
      count: totalCountUsers,
    });

    return paginatedUsers;
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

  async findByPasswordRecoveryCode(code: string): Promise<IUser | null> {
    return await this.userModel
      .findOne()
      .where({
        'passwordRecovery.passwordRecoveryCode': code,
      })
      .exec();
  }

  async findUserByRefreshToken(token: string): Promise<IUser | null> {
    return await this.userModel.findOne({ 'sessions.refreshToken': token });
  }

  async findBadToken(token: string): Promise<IUser | null> {
    return await this.userModel
      .findOne()
      .where({
        'sessions.badTokens': { $in: token },
      })
      .exec();
  }
}
