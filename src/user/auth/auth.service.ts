import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { TokenPayloadDTO } from "./auth.dto";

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) {
    }

    signAdmin(dto: TokenPayloadDTO) {
        const token =
            this.jwtService.sign(dto, { expiresIn: "6h" })
        return token;
    }

    signUser(dto: TokenPayloadDTO) {
        const token =
            this.jwtService.sign(dto, { expiresIn: "6h" })
        return token;
    }

    verify(token: string) {
        try {
            const decoded = this.jwtService.verify(token) as TokenPayloadDTO;
            return decoded;
        } catch (_) {
            throw new UnauthorizedException("토큰이 만료했거나 로그인을 하셔야합니다")
        }
    }


}