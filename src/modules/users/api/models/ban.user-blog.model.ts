import { IsBoolean, IsString, MinLength } from "class-validator"

export class BanUserBlogInputModel{
    @IsBoolean()
    readonly isBanned: boolean
    @IsString()
    @MinLength(20)
    readonly banReason: string
    @IsString()
    blogId: string
}