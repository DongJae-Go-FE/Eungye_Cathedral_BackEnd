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

    const totalPages = Math.ceil(totalCount / limit);

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
      totalPages: totalPages,
      list: notices,
    };
  }

  async findOneNotices(id: number) {
    const notices = await this.prisma.notices.findUnique({
      where: {
        id: id,
      },
    });
    if (!notices) {
      throw new NotFoundException(`${id}번 공지사항은 존재하지 않습니다`);
    }
    return notices;
  }

  async findAdjacentNotices(id: number) {
    const allNotices = await this.prisma.news.findMany({
      select: {
        id: true,
        title: true,
        created_at: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const currentIndex = allNotices.findIndex((notices) => notices.id === id);

    if (currentIndex === -1) {
      throw new NotFoundException(`${id}번 공지사항은 존재하지 않습니다`);
    }

    const previousNotices =
      currentIndex > 0 ? allNotices[currentIndex - 1] : null;
    const nextNotices =
      currentIndex < allNotices.length - 1
        ? allNotices[currentIndex + 1]
        : null;

    return {
      previous: previousNotices || { message: '이전 글이 없습니다' },
      next: nextNotices || { message: '다음 글이 없습니다' },
    };
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
