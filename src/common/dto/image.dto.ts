import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class ImageDto {
  @IsUrl({}, { message: 'IMAGES_SRC_INVALID' })
  src: string;

  @IsOptional()
  @IsPositive({ message: 'IMAGE_WIDTH_POSITIVE' })
  @IsNumber({}, { message: 'IMAGE_WIDTH_NUMBER' })
  width?: number;

  @IsOptional()
  @IsPositive({ message: 'IMAGE_HEIGHT_POSITIVE' })
  @IsNumber({}, { message: 'IMAGE_HEIGHT_NUMBER' })
  height?: number;

  @IsOptional()
  @IsString({ message: 'IMAGE_ALT_MUST_STRING' })
  alt?: string;
}
