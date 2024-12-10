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
  // ApiQuery,
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
        data: [
          {
            id: 1,
            title: 'string',
            created_at: 'string',
            content: 'string',
            imgUrl: 'string',
          },
        ],
      },
    },
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const data = await this.newsService.findAllNews(pageNumber, limitNumber);
    return {
      page: pageNumber,
      limit: limitNumber,
      data: data,
    };
  }

  // @Get('/search')
  // @ApiOperation({
  //   summary: '본당소식 검색하기',
  //   description: '미정 기준으로 검색합니다',
  // })
  // @ApiQuery({
  //   name: 'q',
  //   type: String,
  //   description: '미정 검색',
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: NewsEntity,
  //   isArray: true,
  // })
  // findSearchResult(@Query('q') q?: string) {
  //   return this.newsService.search???(q);
  // }

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
          // nullable: true,
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
