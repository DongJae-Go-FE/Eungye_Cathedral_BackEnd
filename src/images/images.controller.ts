import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly ImagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: '이미지 업로드 성공입니다.' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const url = await this.ImagesService.uploadImage(file);
    return { url };
  }
}
