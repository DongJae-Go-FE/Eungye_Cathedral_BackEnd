import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    const passwordMatch = user.password === password;

    if (!user || !user.password || !passwordMatch) {
      throw new Error('유저 정보가 없거나 틀렸습니다.');
    }

    return user;
  }
}
