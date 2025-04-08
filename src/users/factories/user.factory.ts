import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserType } from '../dto/user-type';

export class UserFactory {
  private static generateCPF(): string {
    const numbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    const dv1 = Math.floor(Math.random() * 10);
    const dv2 = Math.floor(Math.random() * 10);
    return `${numbers.slice(0, 3).join('')}.${numbers.slice(3, 6).join('')}.${numbers.slice(6, 9).join('')}-${dv1}${dv2}`;
  }

  private static generateCNPJ(): string {
    const numbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    return `${numbers[0]}${numbers[1]}.${numbers.slice(2, 5).join('')}.${numbers.slice(5, 8).join('')}/0001-${numbers.slice(8, 12).join('')}`;
  }


  static create(type: UserType, hasProfilemage: boolean = false): CreateUserDto {
    const baseUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
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
      case 'agency':
        return {
          ...baseUser,
          type,
          legalName: `${companyName} LTDA`,
          tradeName: companyName,
          companyId: this.generateCNPJ()
        };

      case 'owner':
        return {
          ...baseUser,
          type,
          personalFirstName: faker.person.firstName(),
          personalLastName: faker.person.lastName(),
          personalId: this.generateCPF()
        };

      case 'salesperson':
        return {
          ...baseUser,
          type,
          personalFirstName: faker.person.firstName(),
          personalLastName: faker.person.lastName(),
          personalId: this.generateCPF(),
          creci: `${faker.number.bigInt({ min: 100000, max: 999999 })}`,
          creciState: ['GO', 'DF'][Math.floor(Math.random() * 2)]
        };

      default:
        throw new Error('Invalid user type');
    }
  }
}
