import { Injectable } from '@nestjs/common';
import { PUB_STATUS, QuestionViewModel } from '../api/models/view';
import { GetQueryParamsQuestionDto } from '../api/models/input';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { SortDirection } from '../../../modules/paginator/models/query-params.model';
import {
  IQuestionEntity,
  QuestionDocument,
} from '../domain/interface/question.interface';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Questions } from '../domain/model/question.schema';

@Injectable()
export class QuizQueryRepository {
  constructor(
    @InjectModel(Questions.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  buildResponseQuestion(question: IQuestionEntity): QuestionViewModel {
    return {
      id: question._id.toString(),
      body: question.bodyQuestion,
      correctAnswers: question.correctAnswers,
      published: question.published,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt ? question.updatedAt.toISOString() : null,
    };
  }

  async getQuestionById(newQuestionId: string): Promise<QuestionDocument> {
    const question = await this.questionModel
      .findOne({ _id: new Types.ObjectId(newQuestionId) })
      .exec();
    return question;
  }

  private createRegExp(value: string): RegExp {
    return new RegExp('(' + value.toLowerCase() + ')', 'i');
  }

  async getQuestions(
    query?: GetQueryParamsQuestionDto,
  ): Promise<Paginated<QuestionViewModel[]>> {
    const sortDefault = 'createdAt';
    let sort = `-${sortDefault}`;
    if (query?.sortBy && query?.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}`)
        : (sort = `${query.sortBy}`);
    } else if (query?.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${sortDefault}`)
        : (sort = sortDefault);
    } else if (query?.sortBy) {
      sort = `-${query.sortBy}`;
    }

    const whereCondition = [];

    if (query?.bodySearchTerm) {
      whereCondition.push({
        bodyQuestion: this.createRegExp(query.bodySearchTerm),
      });
    }

    //Filter
    let filter = this.questionModel.find();
    if (query?.publishedStatus) {
      switch (query.publishedStatus) {
        case PUB_STATUS.PUBLISHED:
          filter.where({ published: true });
          break;
        case PUB_STATUS.NOT_PUBLISHED:
          filter.where({ published: false });
          break;
        default:
          break;
      }
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountQuestions = await this.questionModel.count(filter);

    const questions = await this.questionModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedQuestions = Paginated.getPaginated<QuestionViewModel[]>({
      items: questions.map((question) => this.buildResponseQuestion(question)),
      page: page,
      size: size,
      count: totalCountQuestions,
    });

    return paginatedQuestions;
  }
}
