import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FilesModule),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
