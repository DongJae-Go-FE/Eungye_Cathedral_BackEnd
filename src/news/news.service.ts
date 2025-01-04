import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
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

  async findAllNews(page: number, limit: number, q?: string) {
    const skip = (page - 1) * limit;
    const whereSearch = q
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            // { content: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const totalCount = await this.prisma.news.count({
      where: whereSearch,
    });

    const news = await this.prisma.news.findMany({
      where: whereSearch,
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      total: totalCount,
      list: news,
    };
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
