import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema()
class Source {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

@Schema({ timestamps: true })
export class News {
  @Prop({ type: Source, required: true })
  source: Source;

  @Prop()
  author?: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  urlToImage?: string;

  @Prop({ required: true })
  publishedAt: Date;

  @Prop()
  content?: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
