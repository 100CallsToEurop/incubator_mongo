import { HydratedDocument, Model, Types } from 'mongoose';
import { Questions } from '../model/question.schema';
import { QuestionEntity } from '../entity/question.entity';

export interface IQuestion {
  _id?: Types.ObjectId;
  bodyQuestion: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IQuestionEntity = IQuestion & IQuestionMethods;

export interface IQuestionMethods {

}

export type QuestionDocument = HydratedDocument<Questions>;

export type QuestionStaticType = {
  createQuestion: (
    newQuestion: QuestionEntity,
    QuestionModel: QuestionModelType,
  ) => QuestionDocument;
};

export type QuestionModelType = Model<QuestionDocument> & QuestionStaticType;