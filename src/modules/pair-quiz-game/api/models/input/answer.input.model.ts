import { IsNotEmpty, IsString } from "class-validator";

export class AnswerInputModel{
    @IsString()
    @IsNotEmpty()
    answer: string
}