import { IsBoolean, IsString, MaxLength } from "class-validator"

export class BanUserInputModel{
    @IsBoolean()
    readonly isBanned: boolean
    @IsString()
    @MaxLength(20)
    readonly banReason: string
}