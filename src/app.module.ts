import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './news/news.module';
import { NoticesModule } from './notices/notices.module';
import { WeeklysModule } from './weeklys/weeklys.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, NewsModule, NoticesModule, WeeklysModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
