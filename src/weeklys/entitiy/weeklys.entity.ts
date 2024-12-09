import { ApiProperty } from '@nestjs/swagger';

export class WeeklyseEntity {
  @ApiProperty({
    description: '아이디',
  })
  id: number;

  @ApiProperty({
    description: '타이틀',
  })
  title: string;

  @ApiProperty({
    description: '이미지 URL',
  })
  imgUrl: string;
}
