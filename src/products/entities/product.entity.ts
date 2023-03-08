import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
  //Vamos a hacer que la propiedad price sea indexada...
  @Prop({ type: Number, required: true, index: true })
  price: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
//Indexacion compuesta, si se pregunta por mas de un campo a la vez, 1 para ordenar de forma ascendente, -1 para ordenar de forma descendente
ProductSchema.index({ price: 1, stock: -1 });
