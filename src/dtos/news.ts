import {
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
  IsDateString,
  isURL,
} from 'class-validator';
import { Type } from 'class-transformer';

class SourceDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class NewsDto {
  @IsObject()
  @ValidateNested()
  @Type(() => SourceDto)
  source: SourceDto;

  @IsOptional()
  @IsString()
  author?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  url: string;

  @IsOptional()
  urlToImage?: string;

  @IsDateString()
  publishedAt: Date;

  @IsOptional()
  @IsString()
  content?: string;
}
