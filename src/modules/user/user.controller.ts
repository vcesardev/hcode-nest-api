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

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body) {
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
  async update(@Param() params, @Body() body) {
    const { id } = params;
    return { user: { body }, id, method: 'put' };
  }

  @Patch(':id')
  async partialUpdate(@Param() params, @Body() body) {
    const { id } = params;
    return { user: { body }, id, method: 'patch' };
  }

  @Delete(':id')
  async delete(@Param() params, @Body() body) {
    const { id } = params;
    return { user: { body }, id, method: 'delete' };
  }
}
