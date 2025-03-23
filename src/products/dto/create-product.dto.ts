import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNumber()
    @IsNotEmpty()
    public price: number;

    @IsNumber()
    @IsNotEmpty()
    public vat: number;

    @IsNumber()
    @IsNotEmpty()
    public quantity: number;

    @IsString()
    @IsNotEmpty()
    public category: string;

    @IsString()
    @IsOptional()
    public description: string;

    @IsArray()
    @IsOptional()
    public images: {name: string, path: string}[];
}
