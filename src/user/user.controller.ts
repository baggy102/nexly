import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidateBusinessNumberDTO } from './dto/user.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('validate/business')
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
}
