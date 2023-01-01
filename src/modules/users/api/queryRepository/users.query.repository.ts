import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Paginated } from '../../../../modules/paginator/models/paginator';
import { SortDirection } from '../../../../modules/paginator/models/query-params.model';
import { UserViewModel } from './dto';
import { UserDocument } from '../../domain/interfaces/user.interface';
import { User } from '../../domain/model/user.schema';

import {
  GetQueryParamsUserDto,
  GetQueryParamsUserDtoForSA,
  userBan,
} from '../models';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private buildResponseUser(user: User): UserViewModel {
    const { isBanned, banDate, banReason } = user.getBanUserInfo();
    return {
      id: user._id.toString(),
      login: user.getUserLogin(),
      email: user.getUserEmail(),
      createdAt: user.getCreatedAt().toISOString(),
      banInfo: {
        isBanned: isBanned ? isBanned : false,
        banDate: banDate ? banDate.toISOString() : null,
        banReason: banReason ? banReason : null,
      },
    };
  }

  private createRegExp(value: string): RegExp {
    return new RegExp('(' + value.toLowerCase() + ')', 'i');
  }

  async getUserById(userId: string): Promise<UserViewModel> {
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(userId) })
      .exec();
    if (!user) {
      throw new NotFoundException();
    }
    return this.buildResponseUser(user);
  }

  async getUsers(
    query?: GetQueryParamsUserDto | GetQueryParamsUserDtoForSA,
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

    if (query instanceof GetQueryParamsUserDtoForSA)
      if (query && query.banStatus) {
        if (query.banStatus === userBan.ALL) {
          whereCondition.push({
            $or: [
              { 'accountData.banInfo.isBanned': true },
              { 'accountData.banInfo.isBanned': false },
            ],
          });
        }
        if (query.banStatus === userBan.BANNED) {
          whereCondition.push({ 'accountData.banInfo.isBanned': true });
        }
        if (query.banStatus === userBan.NOT_BANNED) {
          whereCondition.push({ 'accountData.banInfo.isBanned': false });
        }
      }

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

  async findUserIdByRefreshToken(token: string): Promise<string | null> {
    const user = await this.userModel.findOne({
      'sessions.refreshToken': token,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user._id.toString();
  }
}
