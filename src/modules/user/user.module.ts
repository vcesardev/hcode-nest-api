import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from './user.service';
import { UserIdCheckMiddleware } from '../../middlewares/user-id-check.middleware';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: '/users/:id',
      method: RequestMethod.ALL,
    });
  }
}
