import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionInputModel } from '../../api/models/input';
import { QuizRepository } from '../../infrastructure';
import { QuestionEntity } from '../../domain/entity/question.entity';
import { QuestionModelType } from '../../domain/interface/question.interface';

export class CreateQuestionCommand {
  constructor(public dto: QuestionInputModel) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly QuestionModel: QuestionModelType,
  ) {}
  async execute({ dto }: CreateQuestionCommand): Promise<string> {
    const newQuestionEntity = new QuestionEntity(dto);
    const newQuestion = this.QuestionModel.createQuestion(
      newQuestionEntity,
      this.QuestionModel,
    );
    await this.quizRepository.save(newQuestion);
    return newQuestion._id.toString();
  }
}
