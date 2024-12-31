import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class ImagesService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const { error } = await this.supabase.storage
      .from('images')
      .upload(file.originalname, file.buffer);

    if (error) {
      throw new Error(error.message);
    }

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${file.originalname}`;
    await this.prisma.images.create({ data: { url } });
    return url;
  }
}
