import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/IcreateUser.dto';
import { UpdatePartialUserDTO } from './dtos/IupdatePartialUser.dto';
import { UpdateUserDTO } from './dtos/IupdateUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.userService.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(':id')
  async findOne(@Param() params) {
    const { id } = params;
    return this.userService.findById(Number(id));
  }

  // @Put(':id')
  // async update(
  //   @Param() params,
  //   @Body() { email, name, password }: UpdateUserDTO,
  // ) {
  //   const { id } = params;
  //   return { user: { email, name, password }, id, method: 'put' };
  // }

  @Patch(':id')
  async partialUpdate(
    @Param() params,
    @Body() { email, name, password }: UpdatePartialUserDTO,
  ) {
    const { id } = params;
    return await this.userService.updateById(Number(id), {
      email,
      name,
      password,
      updatedAt: new Date(),
    });
  }

  @Delete(':id')
  async delete(@Param() params, @Body() body) {
    const { id } = params;
    return await this.userService.deleteById(Number(id));
  }
}
