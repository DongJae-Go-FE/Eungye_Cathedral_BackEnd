import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiConsumes,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { UploadImagesDto } from './dto/upload-images.dto';
import { UploadImagesResponse } from './dto/upload-images-response.dto';

@ApiTags('이미지 업로드')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @ApiOperation({
    summary: '이미지 파일 업로드',
    description:
      '해당 API 통신을 통해 이미지 파일을 업로드하고 URL을 생성합니다.',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 이미지 파일',
    type: UploadImagesDto,
  })
  @ApiResponse({
    status: 201,
    description: '이미지 업로드 성공입니다.',
    type: UploadImagesResponse,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: '파일이 전달되지 않았습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = await this.imagesService.uploadImage(file);
    return { url };
  }
}
