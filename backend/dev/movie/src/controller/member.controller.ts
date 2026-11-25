import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';
import { AuthGuard } from '../guard/auth.guard';
import { MemberService } from '../service/member.service';

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({
    summary: '닉네임 중복 확인',
    description:
      '사용 가능한 닉네임인지 확인합니다. 토큰 없이 호출할 수 있는 공개 API입니다.',
  })
  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @ApiOperation({
    summary: '이메일 중복 확인',
    description:
      '사용 가능한 이메일인지 확인합니다. 토큰 없이 호출할 수 있는 공개 API입니다.',
  })
  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
    return this.memberService.checkEmail(email);
  }

  @ApiOperation({
    summary: '회원가입',
    description:
      '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 정보 조회',
    description: '토큰으로 로그인한 회원의 정보를 조회합니다.',
  })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: Request) {
    const memberId = request['memberId'] as number;
    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 정보 수정',
    description: '토큰으로 로그인한 회원의 정보를 수정합니다.',
  })
  @ApiBearerAuth()
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: Request,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.memberService.updateMyInfo(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }
}
