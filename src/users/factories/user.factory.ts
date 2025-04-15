import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../dto/create-user.dto';
import { StateType, UserTypesEnum } from '../dto/types';

export class UserFactory {
  private static generateCPF(formatted: boolean = true): string {
    const generateDigits = (base: string, weights: number[]): number => {
      const sum = base.split('').reduce((acc, digit, index) =>
        acc + parseInt(digit, 10) * weights[index], 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    let cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
    cpf += generateDigits(cpf, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    cpf += generateDigits(cpf, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
    if (/^(\d)\1{10}$/.test(cpf)) return this.generateCPF(formatted);

    return formatted
      ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      : cpf;
  };

  private static generateCNPJ(formatted: boolean = true): string {
    const calculateDigit = (base: string, weights: number[]): number => {
      const sum = weights.reduce((acc, weight, index) =>
        acc + parseInt(base[index], 10) * weight, 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    let cnpj = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
    cnpj += calculateDigit(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    cnpj += calculateDigit(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return formatted
      ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      : cnpj;
  };

  static create(type: UserTypesEnum, hasProfilemage: boolean = false): CreateUserDto {
    const baseUser = {
      type,
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10, prefix: '#1A' }),
      phoneNumber: faker.helpers.fromRegExp(/([0-9]{2}) [0-9]{5}-[0-9]{4}/),
      whatsappNumber: faker.helpers.fromRegExp(/([0-9]{2}) [0-9]{5}-[0-9]{4}/),
      profileImage: hasProfilemage ? {
        src: `https://picsum.photos/200?random=${Math.random()}`,
        width: 200,
        height: 200
      } : undefined,
    };

    const companyName = faker.company.name();

    switch (type) {
      case UserTypesEnum.AGENCY:
        return {
          ...baseUser,
          legalName: `${companyName} LTDA`,
          tradeName: companyName,
          companyId: this.generateCNPJ()
        };

      case UserTypesEnum.SALESPERSON:
        return {
          ...baseUser,
          personalFirstName: faker.person.firstName(),
          personalLastName: faker.person.lastName(),
          personalId: this.generateCPF(),
          creci: `${faker.number.bigInt({ min: 100000, max: 999999 })}`,
          creciState: [StateType.DF, StateType.GO][Math.floor(Math.random() * 2)]
        };

      default:
        return {
          ...baseUser,
          personalFirstName: faker.person.firstName(),
          personalLastName: faker.person.lastName(),
          personalId: this.generateCPF()
        };
    }
  }
}
