import { Injectable, NotFoundException } from '@nestjs/common';

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

  async findAllNotices() {
    return await this.prisma.notices.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
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
