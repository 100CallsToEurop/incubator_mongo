import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { PostInputModel } from '../../api/models';
import { PostEntity } from '../../domain/entity/post.entity';
import { PostDocument, PostModelType } from '../../domain/interfaces/post.interface';
import { Post } from '../../domain/model/post.schema';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public post: PostInputModel, public userId?: string) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectModel(Post.name)
    private readonly PostModel: PostModelType, 
    private readonly postsRepository: PostsRepository) {}

  async execute(command: CreatePostCommand): Promise<PostDocument> {
    const { post, userId } = command;
    const blog = await this.postsRepository.getGetBlog(post.blogId)
    const blogName = blog.getName()
    if (blog.checkOwnerBlog(userId)) {
      throw new ForbiddenException();
    }
    const newPostEntity = new PostEntity(post, blogName, userId);
    const newPost = this.PostModel.createPost(newPostEntity, this.PostModel);
    await this.postsRepository.save(newPost);
    return newPost;
  }
}
