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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
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
import { NewsEntity } from './entitiy/news.entity';
import { UpdateNewsDto } from './dto/update-news.dto';

@ApiTags('본당소식 (본당소식 API)')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /*
   * GET
   */
  @Get()
  @ApiOperation({
    summary: '모든 본당소식 불러오기',
    description: '데이터베이스에 저장되어있는 모든 본당소식을 불러옵니다.',
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
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('q') q?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const data = await this.newsService.findAllNews(pageNumber, limitNumber, q);
    return {
      page: pageNumber,
      limit: limitNumber,
      data: data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 본당소식 불러오기',
    description: 'id를 기준으로 특정 본당소식의 정보를 불러옵니다',
  })
  @ApiParam({
    name: 'id',
    description: '정보를 불러오려는 본당소식의 아이디',
    type: Number,
  })
  @ApiOkResponse({
    type: NewsEntity,
  })
  @ApiNotFoundResponse({
    description: '{id}번 본당소식은 존재하지 않습니다',
  })
  findOne(@Param('id') id: number) {
    return this.newsService.findOneNews(id);
  }

  @Get(':id/adjacent')
  @ApiOperation({
    summary: '지금 보고있는 상세 페이지 이전글과 다음글 정보 불러오기',
    description:
      '본당소식 상세 페이지의 id를 기준으로 이전글과 다음글의 정보를 불러옵니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이전글과 다음글 정보를 불러오려는 본당소식의 아이디',
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
    return this.newsService.findAdjacentNews(id);
  }

  /*
   * POST
   */
  @Post()
  @ApiOperation({
    summary: '새로운 본당소식 생성하기',
    description: '새로운 본당소식을 생성합니다.',
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
    type: NewsEntity,
  })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.createNews(createNewsDto);
  }

  /*
   * PATCH
   */
  @Patch(':id')
  @ApiOperation({
    summary: '본당소식 정보 수정하기',
    description: '특정 본당소식의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '정보를 수정하려는 본당소식의 아이디',
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
    type: NewsEntity,
  })
  @ApiNotFoundResponse()
  update(@Param('id') id: number, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(id, updateNewsDto);
  }

  /*
   * DELETE
   */
  @Delete(':id')
  @ApiOperation({
    summary: '본당소식 삭제하기',
    description: '특정 본당소식을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '삭제하려는 본당소식의 아이디',
    type: Number,
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  delete(@Param('id') id: number) {
    return this.newsService.removeNews(id);
  }
}
