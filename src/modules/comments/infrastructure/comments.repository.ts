import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Interfaces
import { CommentDocument } from '../domain/interfaces/comment.interface';

//Schema
import { Comments } from '../domain/model/comment.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async save(model: CommentDocument) {
    return await model.save();
  }

  async getCommentById(commentId: string): Promise<CommentDocument> {
    return await this.commentModel
      .findOne({ _id: new Types.ObjectId(commentId) })
      .exec();
  }

  async deleteCommentById(commentId: string): Promise<boolean> {
    const commentDelete = await this.commentModel
      .findOneAndDelete({ _id: new Types.ObjectId(commentId) })
      .exec();
    return commentDelete ? true : false;
  }
}
