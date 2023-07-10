import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/IcreateUser.dto';
import { UpdatePartialUserDTO } from './dtos/IupdatePartialUser.dto';
import { UserService } from './user.service';
import { LogInterceptor } from '../../interceptors/log.interceptor';
import { ParamId } from '../../decorators/paramId-decorator';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../types/User';
import { RoleGuard } from '../../guards/common/role.guard';
import { AuthGuard } from '../../guards/auth/auth.guard';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.userService.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @Roles(Role.Admin)
  @Get()
  async list() {
    return this.userService.list();
  }

  @Roles(Role.Admin)
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

  @Roles(Role.Admin)
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

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param() params) {
    const { id } = params;
    return await this.userService.deleteById(Number(id));
  }
}
