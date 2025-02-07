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
  ApiQuery,
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
  @ApiQuery({
    name: 'q',
    type: String,
    description: '제목 검색',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: String,
    description: '페이지 시작',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    description: '보여줄 갯수',
    required: true,
  })
  @ApiOkResponse({
    schema: {
      example: {
        page: '1',
        limit: '10',
        data: {
          total: 1,
          totalPages: 1,
          list: [
            {
              id: 1,
              title: 'string',
              created_at: 'string',
              imgUrl: 'string',
            },
          ],
        },
      },
    },
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('q') q?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const data = await this.noticesService.findAllNotices(
      pageNumber,
      limitNumber,
      q,
    );

    return {
      page: pageNumber,
      limit: limitNumber,
      data: data,
    };
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

  @Get(':id/adjacent')
  @ApiOperation({
    summary: '지금 보고있는 상세 페이지 이전글과 다음글 정보 불러오기',
    description:
      '공지사항 상세 페이지의 id를 기준으로 이전글과 다음글의 정보를 불러옵니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이전글과 다음글 정보를 불러오려는 공지사항의 아이디',
    type: Number,
  })
  @ApiOkResponse({
    schema: {
      example: {
        previous: {
          id: 1,
          title: '이전 글 제목',
          created_at: '2023-01-01T00:00:00.000Z',
        },
        next: {
          id: 2,
          title: '다음 글 제목',
          created_at: '2023-01-02T00:00:00.000Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '이전 글이나 다음 글이 없습니다',
  })
  async findAdjacent(@Param('id') id: number) {
    return this.noticesService.findAdjacentNotices(id);
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
          nullable: true,
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
          nullable: true,
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
