import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateWeeklysDto } from './dto/create-weeklys.dto';
import { UpdateWeeklysDto } from './dto/update-weeklys.dto';

@Injectable()
export class WeeklysService {
  constructor(private prisma: PrismaService) {}

  async createWeeklys(createWeeklysDto: CreateWeeklysDto) {
    return await this.prisma.weeklys.create({
      data: { ...createWeeklysDto, id: +createWeeklysDto.id },
    });
  }

  async findAllWeeklys(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.prisma.weeklys.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOneWeeklys(id: number) {
    const news = await this.prisma.weeklys.findUnique({
      where: {
        id: id,
      },
    });
    if (!news) {
      throw new NotFoundException(`${id}번 주보는 존재하지 않습니다`);
    }
    return news;
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
