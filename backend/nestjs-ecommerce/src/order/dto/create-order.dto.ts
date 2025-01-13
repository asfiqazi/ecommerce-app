import { IsArray, IsString, IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: string[];

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}
