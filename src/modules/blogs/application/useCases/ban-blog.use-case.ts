import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../../modules/posts/infrastructure/posts.repository';
import { BanBlogInputModel } from '../../api/models/ban.blog.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class BanBlogCommand {
  constructor(public blogId: string, public banBlogParams: BanBlogInputModel) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async execute(command: BanBlogCommand): Promise<void> {
    const { blogId, banBlogParams } = command;
    const blog = await this.blogsRepository.getBlogById(blogId);

    const { isBanned } = banBlogParams;
    const banDate = isBanned ? new Date() : null;

    blog.setBanInfo(isBanned, banDate);

    await this.postsRepository.hidePostByBlogId(blogId, isBanned);

    await this.blogsRepository.save(blog);
  }
}
