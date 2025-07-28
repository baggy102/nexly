import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserRequestDTO {
    @ApiProperty()
    @IsNotEmpty({ message: "아이디를 입력해주세요" })
    login_id: string;
    @ApiProperty()
    @IsNotEmpty({ message: "패스워드를 입력해주세요" })
    login_pwd: string;
}
