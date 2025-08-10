import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TokenPayloadDTO } from "./auth.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `${configService.get('auth.public_key')}`,
            algorithms: ["RS256"],
        })
    }

    async validate(payload: any) {
        return {
            user_id: payload.user_id,
        } as TokenPayloadDTO;
    }

}