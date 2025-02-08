import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateWeeklysDto } from './dto/create-weeklys.dto';
import { UpdateWeeklysDto } from './dto/update-weeklys.dto';

@Injectable()
export class WeeklysService {
  constructor(private prisma: PrismaService) {}

  async createWeeklys(createWeeklysDto: CreateWeeklysDto) {
    return await this.prisma.weeklys.create({
      data: { ...createWeeklysDto },
    });
  }

  async findAllWeeklys(page: number, limit: number, q?: string) {
    const skip = (page - 1) * limit;
    const whereSearch = q
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            // { content: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const totalCount = await this.prisma.weeklys.count({
      where: whereSearch,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const weeklys = await this.prisma.weeklys.findMany({
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
      list: weeklys,
    };
  }

  async findOneWeeklys(id: number) {
    const weeklys = await this.prisma.weeklys.findUnique({
      where: {
        id: id,
      },
    });
    if (!weeklys) {
      throw new NotFoundException(`${id}번 주보는 존재하지 않습니다`);
    }
    return weeklys;
  }

  async findAdjacentWeeklys(id: number) {
    const allWeeklys = await this.prisma.weeklys.findMany({
      select: {
        id: true,
        title: true,
        created_at: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const currentIndex = allWeeklys.findIndex((weeklys) => weeklys.id === id);

    if (currentIndex === -1) {
      throw new NotFoundException(`${id}번 주보 존재하지 않습니다`);
    }

    const previousWeeklys =
      currentIndex > 0 ? allWeeklys[currentIndex - 1] : null;
    const nextWeeklys =
      currentIndex < allWeeklys.length - 1
        ? allWeeklys[currentIndex + 1]
        : null;

    return {
      previous: previousWeeklys || { title: '이전 글이 없습니다' },
      next: nextWeeklys || { title: '다음 글이 없습니다' },
    };
  }

  async updateWeeklys(id: number, updateWeeklysDto: UpdateWeeklysDto) {
    return await this.prisma.weeklys.update({
      where: {
        id: +id,
      },
      data: updateWeeklysDto,
    });
  }

  async removeWeeklys(id: number) {
    await this.prisma.weeklys.delete({
      where: {
        id: id,
      },
    });
  }
}
