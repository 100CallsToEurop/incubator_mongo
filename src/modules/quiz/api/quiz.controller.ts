import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { QuizQueryRepository } from '../infrastructure';
import { GetQueryParamsQuestionDto, PublishInputModel, QuestionInputModel } from './models/input';
import { QuestionViewModel } from './models/view';
import { CreateQuestionCommand, DeleteQuestionCommand, PublishQuestionCommand, UpdateQuestionCommand } from '../application/useCases';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { Public } from '../../../common/decorators/public.decorator';

@Public()
@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizQueryRepository: QuizQueryRepository,
  ) {}

  @HttpCode(200)
  @Get()
  async getQuestions(
    @Query() query?: GetQueryParamsQuestionDto,
  ): Promise<Paginated<QuestionViewModel[]>> {
    return await this.quizQueryRepository.getQuestions(query);
  }

  @HttpCode(201)
  @Post()
  async createQuestions(
    @Body() dto: QuestionInputModel,
  ): Promise<QuestionViewModel> {
    const newQuestionId = await this.commandBus.execute(
      new CreateQuestionCommand(dto),
    );
    const question = await this.quizQueryRepository.getQuestionById(
      newQuestionId,
    );
    return this.quizQueryRepository.buildResponseQuestion(question);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteQuestions(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @HttpCode(204)
  @Put(':id')
  async updateQuestions(
    @Param('id') id: string,
    @Body() dto: QuestionInputModel,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateQuestionCommand(id, dto));
  }

  @HttpCode(204)
  @Put(':id/publish')
  async publishQuestions(
    @Param('id') id: string,
    @Body() dto: PublishInputModel,
  ): Promise<void> {
    await this.commandBus.execute(new PublishQuestionCommand(id, dto));
  }
}
