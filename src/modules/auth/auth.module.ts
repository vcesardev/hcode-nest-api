import { JwtModule } from '@nestjs/jwt';
import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    forwardRef(() => UserModule),
    PrismaModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
