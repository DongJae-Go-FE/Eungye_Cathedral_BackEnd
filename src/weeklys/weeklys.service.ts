import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWeeklysDto } from './dto/create-weeklys.dto';
import { UpdateWeeklysDto } from './dto/update-weeklys.dto';

@Injectable()
export class WeeklysService {
  constructor(private prisma: PrismaService) {}

  async createWeeklys(createWeeklysDto: CreateWeeklysDto) {
    return this.prisma.weeklys.create({
      data: createWeeklysDto,
    });
  }

  async findAllWeeklys(page: number, limit: number, q?: string) {
    const skip = (page - 1) * limit;

    const whereSearch = q
      ? {
          OR: [{ title: { contains: q, mode: Prisma.QueryMode.insensitive } }],
        }
      : {};

    const [totalCount, weeklys] = await Promise.all([
      this.prisma.weeklys.count({ where: whereSearch }),
      this.prisma.weeklys.findMany({
        where: whereSearch,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      total: totalCount,
      totalPages,
      list: weeklys,
    };
  }

  async findOneWeeklys(id: number) {
    const weeklys = await this.prisma.weeklys.findUnique({
      where: { id },
    });

    if (!weeklys) {
      throw new NotFoundException(`${id}번 주보는 존재하지 않습니다`);
    }

    return weeklys;
  }

  async findAdjacentWeeklys(id: number) {
    const currentWeeklys = await this.prisma.weeklys.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!currentWeeklys) {
      throw new NotFoundException(`${id}번 주보는 존재하지 않습니다`);
    }

    const [previousWeeklys, nextWeeklys] = await Promise.all([
      this.prisma.weeklys.findFirst({
        where: { id: { lt: id } },
        orderBy: { id: 'desc' },
        select: { id: true, title: true, created_at: true },
      }),
      this.prisma.weeklys.findFirst({
        where: { id: { gt: id } },
        orderBy: { id: 'asc' },
        select: { id: true, title: true, created_at: true },
      }),
    ]);

    return {
      previous: previousWeeklys || {
        id: '',
        title: '이전 글이 없습니다',
        created_at: '',
        state: false,
      },
      next: nextWeeklys || {
        id: '',
        title: '다음 글이 없습니다',
        created_at: '',
        state: false,
      },
    };
  }

  async updateWeeklys(id: number, updateWeeklysDto: UpdateWeeklysDto) {
    return this.prisma.weeklys.update({
      where: { id },
      data: updateWeeklysDto,
    });
  }

  async removeWeeklys(id: number) {
    await this.prisma.weeklys.delete({
      where: { id },
    });
  }
}
