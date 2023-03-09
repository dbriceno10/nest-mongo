import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phone: string;

  //supongamos que un costumer tiene skills, y que estas son un array, las guardamos en relacion 1:N embebida
  @Prop({
    type: [{ name: { type: String }, color: { type: String } }],
  })
  skills: Types.Array<Record<string, any>>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
