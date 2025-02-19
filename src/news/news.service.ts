import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async createNews(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: createNewsDto,
    });
  }

  async findAllNews(page: number, limit: number, q?: string) {
    const skip = (page - 1) * limit;

    const whereSearch = q
      ? {
          OR: [{ title: { contains: q, mode: Prisma.QueryMode.insensitive } }],
        }
      : {};

    const [totalCount, news] = await Promise.all([
      this.prisma.news.count({ where: whereSearch }),
      this.prisma.news.findMany({
        where: whereSearch,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          title: true,
          created_at: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      total: totalCount,
      totalPages,
      list: news,
    };
  }

  async findOneNews(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException(`${id}번 본당소식은 존재하지 않습니다`);
    }

    return news;
  }

  async findAdjacentNews(id: number) {
    const [previousNews, nextNews] = await Promise.all([
      this.prisma.news.findFirst({
        where: { id: { lt: id } },
        orderBy: { id: 'desc' },
        select: { id: true, title: true, created_at: true },
      }),
      this.prisma.news.findFirst({
        where: { id: { gt: id } },
        orderBy: { id: 'asc' },
        select: { id: true, title: true, created_at: true },
      }),
    ]);

    return {
      previous: previousNews || {
        id: '',
        title: '이전 글이 없습니다',
        created_at: '',
      },
      next: nextNews || {
        id: '',
        title: '다음 글이 없습니다',
        created_at: '',
      },
    };
  }

  async updateNews(id: number, updateNewsDto: UpdateNewsDto) {
    return this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });
  }

  async removeNews(id: number) {
    await this.prisma.news.delete({
      where: { id },
    });
  }
}
