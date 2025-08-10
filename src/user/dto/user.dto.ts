import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserRequestDTO {
    @ApiProperty()
    @IsNotEmpty({ message: "이메일을 입력해주세요" })
    email: string;
    @ApiProperty()
    @IsNotEmpty({ message: "패스워드를 입력해주세요" })
    password: string;
}

export class SignUpUserRequestDTO {
    @ApiProperty()
    @IsNotEmpty({ message: "이메일을 입력해주세요" })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: "패스워드를 입력해주세요" })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: "이름을 입력해주세요" })
    name: string;

    @ApiProperty()
    phone_number: string;
    
    @ApiProperty()
    @IsNotEmpty({ message: "회사 아이디를 입력해주세요" })
    company_id: string;
}

export class ValidateBusinessNumberDTO {
    @ApiProperty()
    @IsNotEmpty({ message: "사업자등록번호를 입력해주세요" })
    business_number: string;
  
    @ApiProperty()
    @IsNotEmpty({ message: "개업일자를 입력해주세요" })
    start_date: string; // YYYYMMDD 형식
  
    @ApiProperty()
    @IsNotEmpty({ message: "대표자 성명을 입력해주세요" })
    owner_name: string;
}
