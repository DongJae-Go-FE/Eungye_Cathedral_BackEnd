import { ApiProperty } from '@nestjs/swagger';

export class UploadImagesDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
