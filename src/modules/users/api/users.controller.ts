import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Paginated } from 'src/modules/paginator/models/paginator';
import { Public } from '../../../common/decorators/public.decorator';

import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

import { UserViewModel } from './queryRepository/dto';

import { GetQueryParamsUserDto, UserInputModel } from './models';
import { UsersQueryRepository } from './queryRepository/users.query.repository';
import { UserCheckGuard } from '../../../common/guards/users/users-check.guard';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  DeleteUserByIdCommand,
} from '../application/useCases';

@Public()
@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

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
}
