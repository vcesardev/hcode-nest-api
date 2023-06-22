import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
