import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModel } from '../../api/models';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class UpdateBlogByIdCommand {
  constructor(public blogId: string, public updateParam: BlogInputModel) {}
}

@CommandHandler(UpdateBlogByIdCommand)
export class UpdateBlogByIdUseCase
  implements ICommandHandler<UpdateBlogByIdCommand>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogByIdCommand): Promise<void> {
    const { blogId, updateParam } = command;
    const blog = await this.blogsRepository.getBlogById(blogId);
    blog.updateBlog(updateParam);
    await this.blogsRepository.save(blog);
  }
}
