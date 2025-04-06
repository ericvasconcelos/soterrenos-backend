import { IsNumber, IsPositive } from 'class-validator';

export class LandSizeDto {
  @IsPositive({ message: 'FRONT_SIZE_POSITIVE' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'FRONT_SIZE_NUMBER' })
  front: number;

  @IsPositive({ message: 'LEFT_SIZE_POSITIVE' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'LEFT_SIZE_NUMBER' })
  left: number;

  @IsPositive({ message: 'RIGHT_SIZE_POSITIVE' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'RIGHT_SIZE_NUMBER' })
  right: number;

  @IsPositive({ message: 'BACK_SIZE_POSITIVE' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'BACK_SIZE_NUMBER' })
  back: number;
}
