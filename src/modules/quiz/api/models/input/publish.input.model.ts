import { IsBoolean } from "class-validator";

export class PublishInputModel{
    @IsBoolean()
    readonly published: boolean
}