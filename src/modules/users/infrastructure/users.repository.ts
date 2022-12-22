import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { add } from 'date-fns';

//Models
import { UserInputModel } from '../api/models';

//Entity
import { UserEntity } from '../domain/entity/user.entity';

//Intefaces
import { IUser, UserDocument } from '../domain/interfaces/user.interface';

//Schema
import { User} from '../domain/model/user.schema';


@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, //Вот этот @InjectModel(User.name) private readonly userModel: Model<UsersDocuments>,
  ) {}

  async save(model: UserDocument) {
    return await model.save();
  }

  async getUserById(userId: string): Promise<UserDocument> {
    return await this.userModel
      .findById({ _id: new Types.ObjectId(userId) })
      .exec();
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const deleteUser = await this.userModel
      .findByIdAndDelete({ _id: new Types.ObjectId(userId) })
      .exec();
    return deleteUser ? true : false;
  }

  async createUser(User: UserEntity): Promise<string> {
    const newUser = new this.userModel(User);
    await newUser.save();
    return newUser._id.toString();
  }

  async updateUser(userId: string, update: UserInputModel): Promise<boolean> {
    const updateUser = await this.userModel
      .findByIdAndUpdate({ _id: new Types.ObjectId(userId) }, update)
      .exec();
    return updateUser ? true : false;
  }

  async updateConfirmationState(userId: string): Promise<void> {
    const user = await this.userModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(userId) },
        { 'emailConfirmation.isConfirmed': true },
        { new: true },
      )
      .exec();
  }

  async updateConfirmationCode(
    userId: string,
    code: string,
  ): Promise<IUser | null> {
    return await this.userModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(userId) },
        {
          'emailConfirmation.confirmationCode': code,
        },
        { new: true },
      )
      .exec();
  }

  async updateUserPasswordHash(userId: string, newHash: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(userId) },
        {
          'accountData.passwordHash': newHash,
          'passwordRecovery.passwordRecoveryCode': '',
          'passwordRecovery.isConfirmedPassword': false,
        },
        { new: true },
      )
      .exec();
  }

  async updatePasswordRecoveryCode(
    userId: string,
    code: string,
  ): Promise<IUser | null> {
    return await this.userModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(userId) },
        {
          'passwordRecovery.passwordRecoveryCode': code,
          'passwordRecovery.expirationDate': add(new Date(), {
            hours: 1,
            minutes: 3,
          }),
          'passwordRecovery.isConfirmedPassword': true,
        },
        { new: true },
      )
      .exec();
  }

  async updateRefreshToken(
    userId: string,
    token: string | null,
  ): Promise<IUser | null> {
    return await this.userModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(userId) },
        {
          'sessions.refreshToken': token,
        },
        { new: true },
      )
      .lean()
      .exec();
  }

  
  async findUserByToken(
    oldToken: string,
    newToken: string,
  ): Promise<UserDocument> {
    return await this.userModel
      .findOne()
      .where({
        $or: [
          { 'sessions.refreshToken': oldToken },
          { 'sessions.refreshToken': newToken },
        ],
      })
      .exec();
  }

  async findUserByEmailOrLogin(emailOrLogin: string): Promise<UserDocument> {
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

  async findByConfirmCode(code: string): Promise<UserDocument | null> {
    return await this.userModel
      .findOne()
      .where({
        'emailConfirmation.confirmationCode': code,
      })
      .exec();
  }

  async findByPasswordRecoveryCode(code: string): Promise<UserDocument | null> {
    return await this.userModel
      .findOne()
      .where({
        'passwordRecovery.passwordRecoveryCode': code,
      })
      .exec();
  }

  async findBadToken(token: string): Promise<UserDocument | null> {
    return await this.userModel
      .findOne()
      .where({
        'sessions.badTokens': { $in: token },
      })
      .exec();
  }
}
