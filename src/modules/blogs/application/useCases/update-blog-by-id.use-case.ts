import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModel } from '../../api/models';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class UpdateBlogByIdCommand {
  constructor(
    public blogId: string,
    public updateParam: BlogInputModel,
    public userId?: string,
  ) {}
}

@CommandHandler(UpdateBlogByIdCommand)
export class UpdateBlogByIdUseCase
  implements ICommandHandler<UpdateBlogByIdCommand>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogByIdCommand): Promise<void> {
    const { blogId, updateParam, userId } = command;
    const blog = await this.blogsRepository.getBlogById(blogId);
    if(blog.checkOwnerBlog(userId)){
      throw new ForbiddenException()
    }
    blog.updateBlog(updateParam);
    await this.blogsRepository.save(blog);
  }
}
