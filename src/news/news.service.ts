import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto//update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async createNews(createNewsDto: CreateNewsDto) {
    return await this.prisma.news.create({
      data: { ...createNewsDto },
    });
  }

  async findAllNews() {
    return await this.prisma.news.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOneNews(id: number) {
    const news = await this.prisma.news.findUnique({
      where: {
        id: id,
      },
    });
    if (!news) {
      throw new NotFoundException(`${id}번 본당소식은 존재하지 않습니다`);
    }
    return news;
  }

  async updateNews(id: number, updateNewsDto: UpdateNewsDto) {
    return await this.prisma.news.update({
      where: {
        id: +id,
      },
      data: updateNewsDto,
    });
  }

  async removeNews(id: number) {
    await this.prisma.news.delete({
      where: {
        id: id,
      },
    });
  }
}
