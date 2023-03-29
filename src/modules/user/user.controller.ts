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

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return body;
  }

  @Get()
  async list() {
    return { users: [] };
  }

  @Get(':id')
  async findOne(@Param() params) {
    const { id } = params;
    return { users: {}, id };
  }

  @Put(':id')
  async update(
    @Param() params,
    @Body() { email, name, password }: UpdateUserDTO,
  ) {
    const { id } = params;
    return { user: { email, name, password }, id, method: 'put' };
  }

  @Patch(':id')
  async partialUpdate(
    @Param() params,
    @Body() { email, name, password }: UpdatePartialUserDTO,
  ) {
    const { id } = params;
    return { user: { email, name, password }, id, method: 'patch' };
  }

  @Delete(':id')
  async delete(@Param() params, @Body() body) {
    const { id } = params;
    return { user: { body }, id, method: 'delete' };
  }
}
