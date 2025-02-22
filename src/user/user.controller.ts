import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  //   Post,
  Put,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  get(@Param() params) {
    return this.userService.getUser(params.id);
  }

  @Post()
  create(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Put()
  update(@Body() user: User) {
    return this.userService.updateUser(user);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.userService.deleteUser(params.id);
  }
}
