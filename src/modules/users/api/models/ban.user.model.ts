import { IsBoolean, IsString, MinLength } from "class-validator"

export class BanUserInputModel{
    @IsBoolean()
    readonly isBanned: boolean
    @IsString()
    @MinLength(20)
    readonly banReason: string
}