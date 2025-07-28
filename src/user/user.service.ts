import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { pbkdf2Sync } from 'crypto';
import { LoginUserRequestDTO } from './dto/user.dto';

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

  async login(dto: LoginUserRequestDTO) {
    const user = await this.userModel.findOne({ login_id })
    if (!user) {
      throw new BadRequestException('유저가 존재하지 않습니다');
    }
    else if (!this.comparePassword(dto.login_pwd, user.login_pwd)) {
      throw new BadRequestException("패스워드가 맞지 않습니다");
    }

    // JWT 생성 (payload에 _id와 role 포함)
    const token = this.generateToken(user)

    return {
      userId: user._id,
      email: user.email,
      access_token: token,
    };

  private generateToken(user: User) {

    let role = -1;

    return this.authService.signUser({
        user_id: user._id.toString()
    });
  }

  }

