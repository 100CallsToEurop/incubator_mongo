import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IQuestionEntity,
  QuestionDocument,
  QuestionModelType,
  QuestionStaticType,
} from '../interface/question.interface';
import { QuestionEntity } from '../entity/question.entity';
import { PublishInputModel, QuestionInputModel } from '../../api/models/input';
import { Document } from 'mongoose';

@Schema({ collection: 'questions' })
export class Questions extends Document implements IQuestionEntity {
  @Prop({ required: true, type: String })
  body: string;
  @Prop({ required: true, type: [String] })
  correctAnswers: string[];
  @Prop({ required: true, type: Boolean })
  published: boolean;
  @Prop({ required: true, type: Date})
  createdAt: Date;
  @Prop({ type: Date, timestamps: true })
  updatedAt: Date;

  public static createQuestion(
    newQuestionEntity: QuestionEntity,
    QuestionModel: QuestionModelType,
  ): QuestionDocument {
    const newQuestion = new QuestionModel(newQuestionEntity);
    return newQuestion;
  }

  updateQuestion(dto: QuestionInputModel): void {
    this.body = dto.body;
    this.correctAnswers = dto.correctAnswers;
    this.updatedAt = new Date();
  }

  publishedQuestion(dto: PublishInputModel): void {
    this.published = dto.published;
    this.updatedAt = new Date();
  }
}

export const QuestionsSchema = SchemaFactory.createForClass(Questions);
const questionstaticMethod: QuestionStaticType = {
  createQuestion: Questions.createQuestion,
};

QuestionsSchema.statics = questionstaticMethod;
QuestionsSchema.methods.updateQuestion = Questions.prototype.updateQuestion;
QuestionsSchema.methods.publishedQuestion =
  Questions.prototype.publishedQuestion;
