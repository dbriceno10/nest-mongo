import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Customer } from './customer.entity';
import { Product } from 'src/products/entities/product.entity';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Date })
  date: Date;

  //*Relacion 1 a 1 embebida
  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customer: Customer | Types.ObjectId;

  //*Relacion 1 a muchos de forma referenciada
  //*El tipado sera un array de strings (objects id de mongo), aunque en la verificaacion de tipos lo interpreta como un array de productos. Una forma de solucionar esto podria ser no actualizar los productos en el mismo update de la orden, sino hacerlo en un endpoint distinto...
  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
  products: Types.Array<Product>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
