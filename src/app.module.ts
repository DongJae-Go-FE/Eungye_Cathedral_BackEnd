import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './news/news.module';
import { NoticesModule } from './notices/notices.module';
import { WeeklysModule } from './weeklys/weeklys.module';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';

import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    ImagesModule,
    NewsModule,
    NoticesModule,
    WeeklysModule,
    PrismaModule,
    ServeStaticModule.forRoot([
      {
        rootPath: join(__dirname, '..', 'public'),
        serveRoot: '/static/',
      },
    ] as ServeStaticModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
