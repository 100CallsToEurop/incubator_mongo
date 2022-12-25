import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { BlogInputModel } from '../../api/models';
import { BlogEntity } from '../../domain/entity/blog.entity';
import {
  BlogDocument,
  BlogModelType,
} from '../../domain/interfaces/blog.interface';
import { Blog } from '../../domain/model/blog.schema';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public createParam: BlogInputModel) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name)
    private readonly BloModel: BlogModelType,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogDocument> {
    const { createParam } = command;
    const newBlogEntity = new BlogEntity(createParam);
    const newBlog = this.BloModel.createBlog(newBlogEntity, this.BloModel);
    await this.blogsRepository.save(newBlog);
    return newBlog;
  }
}
