import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserRequestDTO, ValidateBusinessNumberDTO } from './dto/user.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/validation/business')
  @ApiResponse({
    status: 200,
    description: '사업자등록번호가 유효합니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 또는 유효하지 않은 사업자등록번호.',
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류.',
  })
  async validateBusinessNumber(@Body() dto: ValidateBusinessNumberDTO) {
    await this.userService.validateBusinessNumber(dto);
    return { message: '사업자등록번호가 유효합니다.' };
  }

  @Post('auth/signup')
  @ApiResponse({
    status: 200,
    description: '회원가입이 완료되었습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '해당 이메일로 이미 등록된 회원이 존재합니다.',
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류.',
  })
  async signUp(@Body() dto: SignUpUserRequestDTO) {
    await this.userService.signUp(dto);
    return { message: '회원가입이 완료되었습니다.' };
  }

  @Post('auth/signin')
  @ApiResponse({
    status: 200,
    description: '로그인이 완료되었습니다.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID 또는 비밀번호가 잘못되었습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류.',
  })
  async signIn(@Body() dto: SignUpUserRequestDTO) {
    await this.userService.signIn(dto);
    return { message: '로그인이 완료되었습니다.' };
  }

}
