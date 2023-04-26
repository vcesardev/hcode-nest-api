import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // provider declara que está nesse module
  exports: [PrismaService], // export da acesso do modulo a tudo
})
export class PrismaModule {}
