import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Query params
import { SortDirection } from '../../paginator/models/query-params.model';

//Models
import { GetQueryParamsUserDto, UserInputModel } from '../api/models';

//DTO
import { UserPaginator, UserViewModel } from '../application/dto';

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

  buildResponseUser(user: IUser): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async getUsers(query?: GetQueryParamsUserDto): Promise<UserPaginator> {
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
      items: items.map((item) => this.buildResponseUser(item)),
    };
  }

  async getUserById(_id: Types.ObjectId): Promise<UserViewModel | null> {
    const user = await this.userModel.findById({ _id }).exec();
    return user ? this.buildResponseUser(user) : null;
  }

  async deleteUserById(_id: Types.ObjectId): Promise<boolean> {
    const deleteUser = await this.userModel.findByIdAndDelete({ _id }).exec();
    return deleteUser ? true : false;
  }

  async createUser(User: UserEntity): Promise<UserViewModel> {
    const newUser = new this.userModel(User);
    await newUser.save();
    return this.buildResponseUser(newUser);
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
        $or: [{ email: emailOrLogin }, { login: emailOrLogin }],
      })
      .exec();
  }
}
