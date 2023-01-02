import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class DeleteBlogByIdCommand {
  constructor(public blogId: string, public userId?: string) {}
}

@CommandHandler(DeleteBlogByIdCommand)
export class DeleteBlogByIdUseCase
  implements ICommandHandler<DeleteBlogByIdCommand>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: DeleteBlogByIdCommand): Promise<void> {
    const { blogId, userId } = command;
    /*\const blog = await this.blogsRepository.getBlogById(blogId);
    if (blog.checkOwnerBlog(userId)) {
      throw new ForbiddenException();
    }*/
    await this.blogsRepository.deleteBlogById(blogId);
  }
}
