import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
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
    if (!file || !file.buffer) {
      throw new Error('파일이 전달되지 않았습니다.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('파일 크기가 10MB를 초과합니다.');
    }

    const validMimeTypes = ['image/jpeg', 'image/png'];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new Error(`허용되지 않는 파일 형식입니다: ${file.mimetype}`);
    }

    const allowedExtensions = ['.jpeg', '.png'];
    const extension = file.originalname.slice(
      ((file.originalname.lastIndexOf('.') - 1) >>> 0) + 2,
    );
    if (!allowedExtensions.includes(`.${extension.toLowerCase()}`)) {
      throw new Error(`허용되지 않는 파일 확장자입니다: ${extension}`);
    }

    const uniqueFileName = `${uuidv4()}-${file.originalname || 'unknown'}`;

    const { error } = await this.supabase.storage
      .from(process.env.STORAGE_BUCKET)
      .upload(uniqueFileName, file.buffer, { upsert: true });

    if (error) {
      throw new Error(`Supabase 업로드 실패: ${error.message}`);
    }

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.STORAGE_BUCKET}/${uniqueFileName}`;

    await this.prisma.images.create({ data: { url } });

    return url;
  }
}
