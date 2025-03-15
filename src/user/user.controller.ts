import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard) // 🔒 Protege el endpoint con JWT
  getMe(@Req() req: any) {
    console.log('✅ req.user en /me');
    return this.userService.getUserProfile(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // 🔒 Protege el endpoint con JWT
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
