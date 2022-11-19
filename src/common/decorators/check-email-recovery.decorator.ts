import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from '../../modules/users/infrastructure/users.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailRecValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(private usersRepository: UsersRepository) {}

  async validate(checkEmail: string): Promise<boolean> {
    const email = await this.usersRepository.findUserByEmailOrLogin(checkEmail);
    if (!email) return false;
    return true;
  }

  defaultMessage(): string {
    throw new HttpException('No Сontent', 204);
  }
}

export function ValidateEmailRecoveryDecorator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUEmailRecovery',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailRecValidatorConstraint,
    });
  };
}
