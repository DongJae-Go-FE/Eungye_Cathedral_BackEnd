import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoticesDto } from './dto/create-notices.dto';
import { UpdateNoticesDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(private prisma: PrismaService) {}

  async createNotices(createNoticesDto: CreateNoticesDto) {
    return this.prisma.notices.create({
      data: createNoticesDto,
    });
  }

  async findAllNotices(page: number, limit: number, q?: string) {
    const skip = (page - 1) * limit;
    const whereSearch = q
      ? {
          OR: [{ title: { contains: q, mode: Prisma.QueryMode.insensitive } }],
        }
      : {};

    const [totalCount, notices] = await Promise.all([
      this.prisma.notices.count({ where: whereSearch }),
      this.prisma.notices.findMany({
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
      list: notices,
    };
  }

  async findOneNotices(id: number) {
    const notices = await this.prisma.notices.findUnique({
      where: { id },
    });

    if (!notices) {
      throw new NotFoundException(`${id}번 공지사항은 존재하지 않습니다`);
    }

    return notices;
  }

  async findAdjacentNotices(id: number) {
    const [previousNotice, nextNotice] = await Promise.all([
      this.prisma.notices.findFirst({
        where: { id: { lt: id } },
        orderBy: { id: 'desc' },
        select: { id: true, title: true, created_at: true },
      }),
      this.prisma.notices.findFirst({
        where: { id: { gt: id } },
        orderBy: { id: 'asc' },
        select: { id: true, title: true, created_at: true },
      }),
    ]);

    return {
      previous: previousNotice || {
        id: '',
        title: '이전 글이 없습니다',
        created_at: '',
      },
      next: nextNotice || {
        id: '',
        title: '다음 글이 없습니다',
        created_at: '',
      },
    };
  }

  async updateNotices(id: number, updateNoticesDto: UpdateNoticesDto) {
    return this.prisma.notices.update({
      where: { id },
      data: updateNoticesDto,
    });
  }

  async removeNotices(id: number) {
    await this.prisma.notices.delete({
      where: { id },
    });
  }
}
