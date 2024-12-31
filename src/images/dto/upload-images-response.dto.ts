import { ApiProperty } from '@nestjs/swagger';

export class UploadImagesResponse {
  @ApiProperty({
    description: '생성된 이미지 URL',
    type: String,
  })
  url: string;
}
