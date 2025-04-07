import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('MUST_BE_NUMERIC_STRING');
    }

    if (parsedValue < 0) {
      throw new BadRequestException('MUST_BE_MORE_THEN_ZERO');
    }

    return parsedValue;
  }
}
