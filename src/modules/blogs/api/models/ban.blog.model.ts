import { IsBoolean } from "class-validator"

export class BanBlogInputModel{
    @IsBoolean()
    readonly isBanned: boolean
}