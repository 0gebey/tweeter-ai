import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SourceDocument = HydratedDocument<Source>;

@Schema()
export class Source {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
