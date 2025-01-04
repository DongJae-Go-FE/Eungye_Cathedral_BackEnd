import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateNoticesDto } from './dto/create-notices.dto';
import { UpdateNoticesDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(private prisma: PrismaService) {}

  async createNotices(createNoticesDto: CreateNoticesDto) {
    return await this.prisma.notices.create({
      data: { ...createNoticesDto },
    });
  }

  async findAllNotices(page: number, limit: number, q?: string) {
    const skip = (page - 1) * limit;
    const whereSearch = q
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            // { content: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const totalCount = await this.prisma.notices.count({
      where: whereSearch,
    });

    const notices = await this.prisma.notices.findMany({
      where: whereSearch,
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      total: totalCount,
      list: notices,
    };
  }

  async findOneNotices(id: number) {
    const news = await this.prisma.notices.findUnique({
      where: {
        id: id,
      },
    });
    if (!news) {
      throw new NotFoundException(`${id}번 공지사항은 존재하지 않습니다`);
    }
    return news;
  }

  async updateNotices(id: number, updateNoticesDto: UpdateNoticesDto) {
    return await this.prisma.notices.update({
      where: {
        id: +id,
      },
      data: updateNoticesDto,
    });
  }

  async removeNotices(id: number) {
    await this.prisma.notices.delete({
      where: {
        id: id,
      },
    });
  }
}
