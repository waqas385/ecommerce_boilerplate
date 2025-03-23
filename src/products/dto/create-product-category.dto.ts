import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductCategoryDto {
    @IsString()
    @IsNotEmpty()
    public name: string;
}
