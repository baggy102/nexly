import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { pbkdf2Sync } from 'crypto';
import { LoginUserRequestDTO, SignUpUserRequestDTO, ValidateBusinessNumberDTO } from './dto/user.dto';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  hashPassword(plainPassword: string) {
    const salt = "7b68d88fae54cee87cbe040ba1b819b4"
    return pbkdf2Sync(plainPassword, salt, 1000, 64, "sha512").toString("hex");
  } 

  comparePassword(plainPassword: string, hashPassword) {
      return this.hashPassword(plainPassword) === hashPassword
  }

  async SignIn(dto: LoginUserRequestDTO) {
    const user = await this.userModel.findOne({ email: dto.email })
    if (!user) {
      throw new BadRequestException('유저가 존재하지 않습니다');
    }
    else if (!this.comparePassword(dto.password, user.password)) {
      throw new BadRequestException("패스워드가 맞지 않습니다");
    }

    // JWT 생성 (payload에 _id와 role 포함)
    const token = this.generateToken(user)

    return {
      userId: user._id,
      email: user.email,
      access_token: token,
    };

  }

  async signUp(dto: SignUpUserRequestDTO) {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다');
    }

    const hashedPassword = this.hashPassword(dto.password);
    const newUser = new this.userModel({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      phone_number: dto.phone_number,
      company_id: dto.company_id,
    });

    const createdUser = await newUser.save();
    const token = this.generateToken(createdUser);
    return {
      userId: createdUser._id,
      email: createdUser.email,
      access_token: token,
    };
  }

  private generateToken(user: User) {

    let role = -1;

    return this.authService.signUser({
        user_id: user._id.toString()
    });
  }

  async validateBusinessNumber(dto: ValidateBusinessNumberDTO): Promise<void> {
    const apiUrl = 'https://api.odcloud.kr/api/nts-businessman/v1/validate';
    const serviceKey = 'YOUR_SERVICE_KEY'; // 국세청 API 서비스 키를 여기에 입력하세요

    const requestBody = {
      businesses: [
        {
          b_no: dto.business_number,
          start_dt: dto.start_date,
          p_nm: dto.owner_name,
          p_nm2: '', // 공동대표자명은 없으므로 빈 문자열
          b_nm: '', // 상호는 생략 가능
          corp_no: '', // 법인등록번호는 생략 가능
          b_sector: '', // 주업태명 생략 가능
          b_type: '', // 주종목명 생략 가능
          b_adr: '', // 사업장주소 생략 가능
        },
      ],
    };

    try {
      const response = await axios.post(apiUrl, requestBody, {
        params: { serviceKey },
        headers: { 'Content-Type': 'application/json' },
      });

      const { data } = response;

      // 정상 호출 여부 확인
      if (data.status_code !== 'OK') {
        throw new BadRequestException('사업자등록번호 인증 요청이 실패했습니다.');
      }

      // 유효성 확인
      const businessData = data.data[0];
      if (businessData.valid !== '01') {
        throw new BadRequestException(
          businessData.valid_msg || '유효하지 않은 사업자등록번호입니다.',
        );
      }
    } catch (error) {
      if (error.response) {
        // 국세청 API에서 반환된 에러 처리
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.status_code || '알 수 없는 오류가 발생했습니다.';

        switch (statusCode) {
          case 400:
            throw new BadRequestException('잘못된 요청입니다. JSON 포맷을 확인하세요.');
          case 404:
            throw new BadRequestException('서비스를 찾을 수 없습니다.');
          case 411:
            throw new BadRequestException('필수 요청 파라미터가 누락되었습니다.');
          case 413:
            throw new BadRequestException('요청 데이터가 너무 많습니다. 최대 100개까지 가능합니다.');
          case 500:
            throw new InternalServerErrorException('국세청 서버에서 오류가 발생했습니다.');
          default:
            throw new InternalServerErrorException(errorMessage);
        }
      } else {
        // 네트워크 또는 기타 오류 처리
        throw new InternalServerErrorException('사업자등록번호 인증 중 오류가 발생했습니다.');
      }
    }
  }

}

