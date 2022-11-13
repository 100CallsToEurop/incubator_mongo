import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

//Guards
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

//Pipe
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//DTO
import { UserPaginator, UserViewModel } from '../application/dto';

//Service
import { UsersService } from '../application/users.service';

//Models
import { GetQueryParamsUserDto, UserInputModel } from './models';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query() query?: GetQueryParamsUserDto,
  ): Promise<UserPaginator> {
    return await this.usersService.getUsers(query);
  }

  /*@Get(':id')
  async getUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<UserViewModel> {
    return await this.usersService.getUserById(id);
  }*/

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(
    @Body() createUserParams: UserInputModel,
  ): Promise<UserViewModel> {
    return await this.usersService.createUser(createUserParams);
  }

  /*@UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateParams: UserInputModel,
  ) {
    await this.usersService.updateUserById(id, updateParams);
  }*/

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.usersService.deleteUserById(id);
  }
}
