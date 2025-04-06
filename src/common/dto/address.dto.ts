import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class AddressDto {
  @Matches(/^\d{5}-?\d{3}$/, { message: 'INVALID_ZIP_CODE' })
  zipCode: string;

  @IsString({ message: 'STREET_MUST_STRING' })
  @MinLength(3, { message: 'STREET_MIN_LENGTH_3' })
  street: string;

  @IsString({ message: 'NUMBER_MUST_STRING' })
  @Matches(/^[0-9]+[a-zA-Z\s]*$/, { message: 'INVALID_ADDRESS_NUMBER' })
  number: string;

  @IsString({ message: 'NEIGHBORHOOD_MUST_STRING' })
  @MinLength(3, { message: 'NEIGHBORHOOD_MIN_LENGTH_3' })
  neighborhood: string;

  @IsString({ message: 'CITY_MUST_STRING' })
  @MinLength(3, { message: 'CITY_MIN_LENGTH_3' })
  city: string;

  @IsString({ message: 'STATE_MUST_STRING' })
  @Length(2, 2, { message: 'STATE_LENGTH_2' })
  @Matches(
    /^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/i,
    { message: 'INVALID_STATE' },
  )
  state: string;

  @IsOptional()
  @IsString({ message: 'COMPLEMENT_MUST_STRING' })
  complement?: string;

  @IsOptional()
  @IsString({ message: 'CONDOMINIUM_MUST_STRING' })
  condominium?: string;
}
