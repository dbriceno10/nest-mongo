import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

//Una vez usamos el ApiProperty de swagger, nos obliga a usarlo en todas las propiedades... un error comun que el al hacer un update, te pida que mandes todo el objeto y no solo lo que quieras actualizar

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `product's name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @IsPositive()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  readonly image: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductsDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @ValidateIf((params) => params.maxPrice)
  @Min(0)
  minPrice: number;

  //Validiacion condicional, si existe minPrice, hacemos que este parametro se obligatorio
  @ValidateIf((params) => params.minPrice)
  @IsPositive()
  maxPrice: number;
}
