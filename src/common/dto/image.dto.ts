import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class ImageDto {
  @ApiProperty({ example: 'httphttps://picsum.photos/200' })
  @IsUrl({}, { message: 'IMAGES_SRC_INVALID' })
  src: string;

  @ApiProperty({ example: 200 })
  @IsOptional()
  @IsPositive({ message: 'IMAGE_WIDTH_POSITIVE' })
  @IsNumber({}, { message: 'IMAGE_WIDTH_NUMBER' })
  width?: number;

  @ApiProperty({ example: 200 })
  @IsOptional()
  @IsPositive({ message: 'IMAGE_HEIGHT_POSITIVE' })
  @IsNumber({}, { message: 'IMAGE_HEIGHT_NUMBER' })
  height?: number;

  @ApiProperty({ example: 'Image alt' })
  @IsOptional()
  @IsString({ message: 'IMAGE_ALT_MUST_STRING' })
  alt?: string;
}
