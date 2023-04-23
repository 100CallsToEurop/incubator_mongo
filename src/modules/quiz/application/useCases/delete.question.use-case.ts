import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../infrastructure';

export class DeleteQuestionCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private readonly quizRepository: QuizRepository) {}
  async execute({ id }: DeleteQuestionCommand): Promise<void> {
    await this.quizRepository.deleteQuestionById(id);
  }
}
