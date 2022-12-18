import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModel } from '../../api/models';
import { BlogEntity } from '../../domain/entity/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public createParam: BlogInputModel) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const { createParam } = command;
    const newBlogEntity = new BlogEntity(createParam);
    const newBlog = await this.blogsRepository.createBlog(newBlogEntity);
    return newBlog;
  }
}
