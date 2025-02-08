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

    const totalPages = Math.ceil(totalCount / limit);

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
      totalPages: totalPages,
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

  async findAdjacentNews(id: number) {
    const allNews = await this.prisma.news.findMany({
      select: {
        id: true,
        title: true,
        created_at: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    const allNewsWithState = allNews.map((news) => ({
      ...news,
      state: true,
    }));

    const currentIndex = allNewsWithState.findIndex((news) => news.id === id);

    if (currentIndex === -1) {
      throw new NotFoundException(`${id}번 본당소식은 존재하지 않습니다`);
    }

    const previousNews =
      currentIndex > 0 ? allNewsWithState[currentIndex - 1] : null;
    const nextNews =
      currentIndex < allNewsWithState.length - 1
        ? allNewsWithState[currentIndex + 1]
        : null;

    return {
      previous: previousNews || {
        id: '',
        title: '이전 글이 없습니다',
        created_at: '',
        state: false,
      },
      next: nextNews || {
        id: '',
        title: '다음 글이 없습니다',
        created_at: '',
        state: false,
      },
    };
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
