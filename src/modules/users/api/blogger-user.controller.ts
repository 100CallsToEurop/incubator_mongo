import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserBlogOwnerCheckGuard } from '../../../common/guards/users/user-blog-owner-check.guard';
import { UserBlogCheckGuard } from '../../../common/guards/users/user-blogs-check.guard';
import { UserCheckGuard } from '../../../common/guards/users/users-check.guard';
import { GetQueryParamsBlogUserDto } from '../../../modules/blogs/api/models';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { BanUserBlogCommand } from '../application/useCases';
import { BanUserBlogInputModel } from './models';
import { BanBlogUserViewModel } from './queryRepository/dto/ban-blog-user.dto';
import { UsersQueryRepository } from './queryRepository/users.query.repository';

@Controller('blogger/users')
export class BloggerUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(UserBlogOwnerCheckGuard)
  @UseGuards(UserCheckGuard)
  @HttpCode(204)
  @Put(':id/ban')
  async BanUser(
    @Param('id') id: string,
    @Body() banUserParams: BanUserBlogInputModel,
  ): Promise<void> {
    await this.commandBus.execute(new BanUserBlogCommand(id, banUserParams));
  }

  @UseGuards(UserBlogCheckGuard)
  @Get('blog/:id')
  async getUser(
    @Param('id') id: string,
    @Query() queryParams?: GetQueryParamsBlogUserDto,
  ): Promise<Paginated<BanBlogUserViewModel[]>> {
    return await this.usersQueryRepository.getBanUserByBlogId(id, queryParams);
  }
}
