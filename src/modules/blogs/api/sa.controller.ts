import { Body, Controller, Get, HttpCode, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UserIdCheckGuard } from '../../../common/guards/users/userid-check.guard';
import { BlogCheckGuard } from '../../../common/guards/blogs/blogs-check.guard';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { GetQueryParamsBlogDto } from './models';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepository } from './queryRepository/blog.query.repository';
import { BindWithUserCommand } from '../application/useCases';
import { Public } from '../../../common/decorators/public.decorator';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { BlogViewModelForSA } from './queryRepository/dto';
import { BanBlogInputModel } from './models/ban.blog.model';
import { BanBlogCommand } from '../application/useCases/ban-blog.use-case';

@Public()
@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @UseGuards(BlogCheckGuard)
  @HttpCode(204)
  @Put(':id/ban')
  async banBlog(
    @Param('id') blogId: string,
    @Body() banBlogParams: BanBlogInputModel,
  ): Promise<void> {
    await this.commandBus.execute(new BanBlogCommand(blogId, banBlogParams));
  }

  @UseGuards(BlogCheckGuard, UserIdCheckGuard)
  @HttpCode(204)
  @Put(':id/bind-with-user/:userId')
  async bindWithUser(
    @Param('id') id: string,
    @Param('id') userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new BindWithUserCommand(id, userId));
  }

  @Get()
  async getBlogs(
    @Query() query?: GetQueryParamsBlogDto,
  ): Promise<Paginated<BlogViewModelForSA[]>> {
    return await this.blogsQueryRepository.getBlogsForSA(query);
  }
}
