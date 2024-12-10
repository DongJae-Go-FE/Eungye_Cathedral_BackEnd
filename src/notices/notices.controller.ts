import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticesDto } from './dto/create-notices.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  // ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { NoticeEntity } from './entitiy/notice.entity';
import { UpdateNoticesDto } from './dto/update-notice.dto';

@ApiTags('공지사항 (공지사항 API)')
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  /*
   * GET
   */
  @Get()
  @ApiOperation({
    summary: '모든 공지사항 불러오기',
    description: '데이터베이스에 저장되어있는 모든 공지사항을 불러옵니다.',
  })
  @ApiOkResponse({
    type: NoticeEntity,
    isArray: true,
  })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.noticesService.findAllNotices(pageNumber, limitNumber);
  }

  // @Get('/search')
  // @ApiOperation({
  //   summary: '공지사항 검색하기',
  //   description: '미정 기준으로 검색합니다',
  // })
  // @ApiQuery({
  //   name: 'q',
  //   type: String,
  //   description: '미정 검색',
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: NoticeEntity,
  //   isArray: true,
  // })
  // findSearchResult(@Query('q') q?: string) {
  //   return this.noticesService.search???(q);
  // }

  @Get(':id')
  @ApiOperation({
    summary: '특정 공지사항 불러오기',
    description: 'id를 기준으로 특정 공지사항의 정보를 불러옵니다',
  })
  @ApiParam({
    name: 'id',
    description: '정보를 불러오려는 공지사항의 아이디',
    type: Number,
  })
  @ApiOkResponse({
    type: NoticeEntity,
  })
  @ApiNotFoundResponse({
    description: '{id}번 공지사항은 존재하지 않습니다',
  })
  findOne(@Param('id') id: number) {
    return this.noticesService.findOneNotices(id);
  }

  /*
   * POST
   */
  @Post()
  @ApiOperation({
    summary: '새로운 공지사항 생성하기',
    description: '새로운 공지사항을 생성합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '아이디',
        },
        title: {
          type: 'string',
          description: ' 제목',
          nullable: true,
        },
        content: {
          type: 'string',
          description: '콘텐츠',
        },
        imgUrl: {
          type: 'string',
          description: '이미지 url',
          // nullable: true,
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: NoticeEntity,
  })
  create(@Body() createNoticesDto: CreateNoticesDto) {
    return this.noticesService.createNotices(createNoticesDto);
  }

  /*
   * PATCH
   */
  @Patch(':id')
  @ApiOperation({
    summary: '공지사항 정보 수정하기',
    description: '특정 공지사항의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '정보를 수정하려는 공지사항의 아이디',
    type: Number,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '아이디',
        },
        title: {
          type: 'string',
          description: ' 제목',
          nullable: true,
        },
        content: {
          type: 'string',
          description: '콘텐츠',
        },
        imgUrl: {
          type: 'string',
          description: '이미지 url',
          // nullable: true,
        },
      },
    },
  })
  @ApiOkResponse({
    type: NoticeEntity,
  })
  @ApiNotFoundResponse()
  update(@Param('id') id: number, @Body() updateNoticesDto: UpdateNoticesDto) {
    return this.noticesService.updateNotices(id, updateNoticesDto);
  }

  /*
   * DELETE
   */
  @Delete(':id')
  @ApiOperation({
    summary: '공지사항 삭제하기',
    description: '특정 공지사항을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '삭제하려는 공지사항의 아이디',
    type: Number,
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  delete(@Param('id') id: number) {
    return this.noticesService.removeNotices(id);
  }
}