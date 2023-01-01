import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserCheckGuard } from '../../../common/guards/users/users-check.guard';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { Public } from '../../../common/decorators/public.decorator';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { BanUserCommand, CreateUserCommand, DeleteUserByIdCommand } from '../application/useCases';
import { BanUserInputModel, GetQueryParamsUserDto, UserInputModel } from './models';
import { UserViewModel } from './queryRepository/dto';
import { UsersQueryRepository } from './queryRepository/users.query.repository';

@Public()
@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class SaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(UserCheckGuard)
  @HttpCode(204)
  @Put(':id')
  async BanUser(
    @Param('id') id: string,
    @Body() banUserParams: BanUserInputModel,
  ): Promise<void> {
    await this.commandBus.execute(new BanUserCommand(id, banUserParams));
  }

  @Post()
  async createUser(
    @Body() createUserParams: UserInputModel,
  ): Promise<UserViewModel> {
    const user = await this.commandBus.execute(
      new CreateUserCommand(createUserParams, true),
    );
    return await this.usersQueryRepository.getUserById(user._id.toString());
  }

  @UseGuards(UserCheckGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserByIdCommand(id));
  }

  @Get()
  async getUsers(
    @Query() query?: GetQueryParamsUserDto,
  ): Promise<Paginated<UserViewModel[]>> {
    return await this.usersQueryRepository.getUsers(query);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserViewModel> {
    return await this.usersQueryRepository.getUserById(id);
  }
}
