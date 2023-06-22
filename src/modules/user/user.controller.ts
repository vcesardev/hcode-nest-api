import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/IcreateUser.dto';
import { UpdatePartialUserDTO } from './dtos/IupdatePartialUser.dto';
import { UserService } from './user.service';
import { LogInterceptor } from '../../interceptors/log.interceptor';
import { ParamId } from '../../decorators/paramId-decorator';

@UseInterceptors(LogInterceptor)
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
  async findOne(@ParamId() id: number) {
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
    @ParamId() id: number,
    @Body() { email, name, password }: UpdatePartialUserDTO,
  ) {
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
