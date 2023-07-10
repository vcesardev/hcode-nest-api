import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dtos/IcreateUser.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePartialUserDTO } from './dtos/IupdatePartialUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({
    email,
    name,
    password,
    createdAt,
    updatedAt,
    role,
  }: CreateUserDTO) {
    const salt = 10;

    password = await bcrypt.hash(password, salt);

    return await this.prisma.user.create({
      data: { email, password, name, createdAt, updatedAt, role },
    });
  }

  async list() {
    const users = await this.prisma.user.findMany();

    const updatedUsers = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return updatedUsers;
  }

  async findById(id: number) {
    await this.exists(id);

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    delete user.password;

    return user;
  }

  async updateById(id: number, data: UpdatePartialUserDTO) {
    const salt = 10;

    data.password = await bcrypt.hash(data.password, salt);

    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async deleteById(id: number) {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('O usuário não foi encontrado');
    }
  }
}
