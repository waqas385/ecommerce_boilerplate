import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductCategoryDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNumber()
    @IsOptional()
    public parentId: number;
}
