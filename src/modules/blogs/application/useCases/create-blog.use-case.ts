import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { BlogInputModel } from '../../api/models';
import { BlogEntity } from '../../domain/entity/blog.entity';
import {
  BlogDocument,
  BlogModelType,
} from '../../domain/interfaces/blog.interface';
import { Blog } from '../../domain/model/blog.schema';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public createParam: BlogInputModel, public user?: MeViewModel) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name)
    private readonly BloModel: BlogModelType,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogDocument> {
    const { createParam, user } = command;
    const newBlogEntity = new BlogEntity(createParam, user);
    const newBlog = this.BloModel.createBlog(newBlogEntity, this.BloModel);
    await this.blogsRepository.save(newBlog);
    return newBlog;
  }
}
