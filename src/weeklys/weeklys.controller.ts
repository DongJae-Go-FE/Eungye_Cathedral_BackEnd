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
import { WeeklysService } from './weeklys.service';
import { CreateWeeklysDto } from './dto/create-weeklys.dto';
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
import { WeeklyseEntity } from './entitiy/weeklys.entity';
import { UpdateWeeklysDto } from './dto/update-weeklys.dto';

@ApiTags('주보 (주보 API)')
@Controller('weeklys')
export class WeeklysController {
  constructor(private readonly weeklysService: WeeklysService) {}

  /*
   * GET
   */
  @Get()
  @ApiOperation({
    summary: '모든 주보 불러오기',
    description: '데이터베이스에 저장되어있는 모든 주보을 불러옵니다.',
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
        data: [
          {
            id: 1,
            title: 'string',
            created_at: 'string',
            imgUrl: 'string',
          },
        ],
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

    const data = await this.weeklysService.findAllWeeklys(
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
  //   summary: '주보 검색하기',
  //   description: '미정 기준으로 검색합니다',
  // })
  // @ApiQuery({
  //   name: 'q',
  //   type: String,
  //   description: '미정 검색',
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: WeeklyseEntity,
  //   isArray: true,
  // })
  // findSearchResult(@Query('q') q?: string) {
  //   return this.weeklysService.search???(q);
  // }

  @Get(':id')
  @ApiOperation({
    summary: '특정 주보 불러오기',
    description: 'id를 기준으로 특정 주보의 정보를 불러옵니다',
  })
  @ApiParam({
    name: 'id',
    description: '정보를 불러오려는 주보의 아이디',
    type: Number,
  })
  @ApiOkResponse({
    type: WeeklyseEntity,
  })
  @ApiNotFoundResponse({
    description: '{id}번 주보은 존재하지 않습니다',
  })
  findOne(@Param('id') id: number) {
    return this.weeklysService.findOneWeeklys(id);
  }

  /*
   * POST
   */
  @Post()
  @ApiOperation({
    summary: '새로운 주보 생성하기',
    description: '새로운 주보을 생성합니다.',
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
        imgUrl: {
          type: 'string',
          description: '이미지 url',
          // nullable: true,
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: WeeklyseEntity,
  })
  create(@Body() createWeeklysDto: CreateWeeklysDto) {
    return this.weeklysService.createWeeklys(createWeeklysDto);
  }

  /*
   * PATCH
   */
  @Patch(':id')
  @ApiOperation({
    summary: '주보 정보 수정하기',
    description: '특정 주보의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '정보를 수정하려는 주보의 아이디',
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
    type: WeeklyseEntity,
  })
  @ApiNotFoundResponse()
  update(@Param('id') id: number, @Body() updateWeeklysDto: UpdateWeeklysDto) {
    return this.weeklysService.updateWeeklys(id, updateWeeklysDto);
  }

  /*
   * DELETE
   */
  @Delete(':id')
  @ApiOperation({
    summary: '주보 삭제하기',
    description: '특정 주보을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '삭제하려는 주보의 아이디',
    type: Number,
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  delete(@Param('id') id: number) {
    return this.weeklysService.removeWeeklys(id);
  }
}
