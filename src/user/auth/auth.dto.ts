export interface TokenPayloadDTO {
    user_id: string
    view_event_mstr?: boolean;
    view_message_result?: boolean;
    iat?: number;
    exp?: number;
    iss?: "nexly";
}
