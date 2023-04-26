import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionInputModel } from '../../api/models/input';
import { QuizQueryRepository, QuizRepository } from '../../infrastructure';

export class UpdateQuestionCommand {
  constructor(public id: string, public dto: QuestionInputModel) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly quizQueryRepository: QuizQueryRepository,
  ) {}
  async execute({ id, dto }: UpdateQuestionCommand): Promise<void> {
    const question = await this.quizQueryRepository.getQuestionById(id);

    question.updateQuestion(dto);
    console.log(question);
    await this.quizRepository.save(question);
  }
}
