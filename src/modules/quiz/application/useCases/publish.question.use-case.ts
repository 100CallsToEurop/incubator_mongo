import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishInputModel } from '../../api/models/input';
import { QuizQueryRepository, QuizRepository } from '../../infrastructure';

export class PublishQuestionCommand {
  constructor(public id: string, public dto: PublishInputModel) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly quizQueryRepository: QuizQueryRepository,
  ) {}
  async execute({ id, dto }: PublishQuestionCommand): Promise<void> {
    const question = await this.quizQueryRepository.getQuestionById(id);
    question.publishedQuestion(dto);
    await this.quizRepository.save(question);
  }
}
