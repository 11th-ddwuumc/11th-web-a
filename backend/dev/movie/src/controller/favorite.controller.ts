import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { AuthGuard } from '../guard/auth.guard';
import { FavoriteService } from '../service/favorite.service';

@ApiTags('즐겨찾기')
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '즐겨찾기 등록',
    description: '로그인한 회원이 영화를 즐겨찾기에 추가합니다.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateFavoriteDto) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 즐겨찾기 목록 조회',
    description: '로그인한 회원의 즐겨찾기를 최신 등록 순으로 조회합니다.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyFavorites(@Req() request: Request) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getMyFavorites(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 여부 조회',
    description: '특정 영화를 즐겨찾기했는지 확인합니다.',
  })
  @Get(':movieId')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getStatus(memberId, movieId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 해제',
    description: '즐겨찾기한 영화를 목록에서 해제합니다.',
  })
  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    await this.favoriteService.delete(memberId, movieId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 해제했습니다.',
      result: null,
    };
  }
}
