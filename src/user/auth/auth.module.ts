import { InternalServerErrorException, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";


@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                privateKey: `${configService.get<string>('auth.private_key')}`,
                publicKey: `${configService.get<string>('auth.public_key')}`,
                signOptions: {
                    algorithm: "RS256",
                    issuer: " nexly",
                },
                secretOrKeyProvider: (
                    requestType: JwtSecretRequestType
                ) => {
                    switch (requestType) {
                        case JwtSecretRequestType.SIGN:
                            return configService.get<string>('auth.private_key');
                        case JwtSecretRequestType.VERIFY:
                            return configService.get<string>('auth.public_key');
                        default:
                            throw new InternalServerErrorException("토큰 처리중 에러가 발생했습니다")
                    }
                },
            }),
            inject: [ConfigService],
        })
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {
}