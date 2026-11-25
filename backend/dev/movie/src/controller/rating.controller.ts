import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express'; // 데코레이터 시그니처에 쓰는 타입은 import type 이어야 합니다
import { RatingService } from '../service/rating.service';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { AuthGuard } from '../guard/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({
    summary: '유저별 평점 조회',
    description:
      '특정 회원이 남긴 평점 목록을 조회합니다. 토큰 없이 호출할 수 있는 공개 API입니다.',
  })
  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @ApiOperation({
    summary: '평점 등록',
    description:
      '로그인한 회원이 영화에 평점을 등록합니다. 같은 영화에 이미 평점이 있으면 409(RATING409_1)를 응답합니다.',
  })
  @ApiBearerAuth()
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateRatingDto) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '평점 수정',
    description:
      '본인이 작성한 평점을 수정합니다. 남의 평점이면 403(RATING403_1), 없는 평점이면 404(RATING404_1)를 응답합니다.',
  })
  @ApiBearerAuth()
  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.update(memberId, ratingId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '평점 삭제',
    description:
      '본인이 작성한 평점을 삭제합니다. 남의 평점이면 403(RATING403_1), 없는 평점이면 404(RATING404_1)를 응답합니다.',
  })
  @ApiBearerAuth()
  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = request['memberId'] as number;

    await this.ratingService.delete(memberId, ratingId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}
