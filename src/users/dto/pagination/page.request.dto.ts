import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageRequestDTO {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly take?: number = 10;

  @Type(() => String)
  @IsOptional()
  @Transform((param) => param.value.toLowerCase())
  readonly search?: string = '';

  public get skip(): number {
    return this.page && this.take ? (this.page - 1) * this.take : 0;
  }
}
