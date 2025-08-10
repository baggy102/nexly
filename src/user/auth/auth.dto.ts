export interface TokenPayloadDTO {
    user_id: string
    iat?: number;
    exp?: number;
    iss?: "nexly";
}
