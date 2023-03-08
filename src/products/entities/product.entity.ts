import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Brand } from './brand.entity';

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

  //raw nos sirve para manejar las relaciones enbebidas (agregar un sub-objeto), Record es una forma de hacer que resuelva la relacion
  @Prop(
    raw({
      name: { type: String },
      image: { type: String },
    }),
  )
  category: Record<string, any>;
  //Brand puede guardar id para referenciar a brand
  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brand: Brand | Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
//Indexacion compuesta, si se pregunta por mas de un campo a la vez, 1 para ordenar de forma ascendente, -1 para ordenar de forma descendente
ProductSchema.index({ price: 1, stock: -1 }, { unique: true });
