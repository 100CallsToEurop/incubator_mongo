import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../../modules/comments/infrastructure/comments.repository';
import { PostsRepository } from '../../../../modules/posts/infrastructure/posts.repository';
import { SecurityDevicesRepository } from '../../../../modules/security-devices/infrastructure/security-devices.repository';
import { BanUserInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';

export class BanUserCommand {
  constructor(public id: string, public banUserParams: BanUserInputModel) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: BanUserCommand): Promise<void> {
    const { id, banUserParams } = command;
    const user = await this.usersRepository.getUserById(id);

    const { isBanned, banReason } = banUserParams;

    const banDate = isBanned ? new Date() : null;
    const banReasonText = isBanned ? banReason : null;

    user.setBanUserInfo(isBanned, banDate, banReasonText);

    await this.postsRepository.hidePostByUserId(id, isBanned);
    await this.commentsRepository.hideCommentByUserId(id, isBanned);
    await this.postsRepository.findLikesPostsByUserIdAndHide(id, isBanned);
    await this.commentsRepository.findLikesCommentsByUserIdAndHide(
      id,
      isBanned,
    );
    await this.securityDevicesRepository.deleteAllSecurityDeviceById(id);
    await this.usersRepository.save(user);
  }
}
