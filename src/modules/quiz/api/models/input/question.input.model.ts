import { IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class QuestionInputModel{
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    @MinLength(10)
    readonly body: string
    @IsNotEmpty()
    @IsArray()
    readonly correctAnswers: string[]
}