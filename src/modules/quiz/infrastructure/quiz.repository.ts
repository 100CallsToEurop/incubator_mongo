import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionDocument } from '../domain/interface/question.interface';
import { Questions } from '../domain/model/question.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectModel(Questions.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async save(model: QuestionDocument) {
    return await model.save();
  }

  async deleteQuestionById(questionId: string): Promise<boolean> {
    const questionDelete = await this.questionModel
      .findOneAndDelete({ _id: new Types.ObjectId(questionId) })
      .exec();
    return questionDelete ? true : false;
  }
}
