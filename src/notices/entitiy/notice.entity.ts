import { ApiProperty } from '@nestjs/swagger';

export class NoticeEntity {
  @ApiProperty({
    description: '아이디',
  })
  id: number;

  @ApiProperty({
    description: '타이틀',
  })
  title: string;

  @ApiProperty({
    description: '콘텐츠',
  })
  content: string;

  @ApiProperty({
    description: '이미지 URL',
  })
  imgUrl: string;
}
