import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/IcreateUser.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePartialUserDTO } from './dtos/IupdatePartialUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ email, name, password, createdAt, updatedAt }: CreateUserDTO) {
    return await this.prisma.user.create({
      data: { email, password, name, createdAt, updatedAt },
    });
  }

  async list() {
    return await this.prisma.user.findMany();
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateById(id: number, data: UpdatePartialUserDTO) {
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
}
