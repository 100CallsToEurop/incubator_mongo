import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQueryRepository, QuizRepository } from '../../infrastructure';
import { NotFoundException } from '@nestjs/common';

export class DeleteQuestionCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly quizQueryRepository: QuizQueryRepository,
  ) {}
  async execute({ id }: DeleteQuestionCommand): Promise<void> {
    const question = await this.quizQueryRepository.getQuestionById(id);
    if (!question) {
      throw new NotFoundException();
    }
    await this.quizRepository.deleteQuestionById(id);
  }
}
