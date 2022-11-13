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
    //Filter  - доделать
    let filter = this.userModel.find();
    let totalCount = (await this.userModel.find(filter).exec()).length;
    if (query && query.searchLoginTerm) {
      filter
        .where('login')
        .regex(new RegExp('^' + query.searchLoginTerm.toLowerCase(), 'i'));
      totalCount = (await this.userModel.find(filter).exec()).length;
    }
    if (query && query.searchEmailTerm) {
      filter
        .where('email')
        .regex(new RegExp('^' + query.searchEmailTerm.toLowerCase(), 'i'));
      totalCount = (await this.userModel.find(filter).exec()).length;
    }

    //Sort
    const sortDefault = '-createdAt';
    let sort = sortDefault;
    if (query && query.sortBy && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}`)
        : (sort = `${query.sortBy}`);
    } else if (query && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = sortDefault)
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
      page,
      pageSize,
      pagesCount,
      totalCount,
      items: items.map((item) => this.buildResponseUser(item)),
    };
  }

  async getUserById(_id: Types.ObjectId): Promise<UserViewModel> {
    const user = await this.userModel.findById({ _id }).exec();
    return this.buildResponseUser(user);
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

  async findUserByEmailOrLogin(emailOrLogin: string) {
    return await this.userModel
      .findOne()
      .where({
        $or: [{ email: emailOrLogin }, { login: emailOrLogin }],
      })
      .exec();
  }
}
