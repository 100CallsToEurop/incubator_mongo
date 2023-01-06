import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../../modules/comments/infrastructure/comments.repository';
import { PostsRepository } from '../../../../modules/posts/infrastructure/posts.repository';
import { BanUserBlogInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';

export class BanUserBlogCommand {
  constructor(public id: string, public banUserParams: BanUserBlogInputModel) {}
}

@CommandHandler(BanUserBlogCommand)
export class BanUserBlogUseCase implements ICommandHandler<BanUserBlogCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: BanUserBlogCommand): Promise<void> {
    const { id, banUserParams } = command;
    const { isBanned, banReason, blogId } = banUserParams;

    const banDate = isBanned ? new Date() : null;
    const banReasonText = isBanned ? banReason : null;

    const user = await this.usersRepository.getUserById(id);
    if (isBanned)
      user.setBanUserBlogInfo(isBanned, banDate, banReasonText, blogId);
    if (!isBanned) user.deleteBanUserBlog(blogId);

    const postsIds = await this.postsRepository.getPostsIdsByBlogId(blogId);

    postsIds.forEach(
      async (postId) =>
        await this.commentsRepository.findLikesCommentsByUserIdAndPostAndHide(
          id,
          postId,
          isBanned,
        ),
    );

    await this.usersRepository.save(user);
  }
}
