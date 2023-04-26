import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from './user.service';

@Module({
  imports: [PrismaService],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
