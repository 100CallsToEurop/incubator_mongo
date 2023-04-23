import { Types } from 'mongoose';
import { IQuestion } from '../interface/question.interface';
import { QuestionInputModel } from '../../api/models/input';

export class QuestionEntity implements IQuestion {
  _id?: Types.ObjectId;
  bodyQuestion: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(command: QuestionInputModel) {
    this._id = new Types.ObjectId();
    this.bodyQuestion = command.body;
    this.correctAnswers = command.correctAnswers;
    this.published = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
