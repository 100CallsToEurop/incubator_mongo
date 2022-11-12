import { PostsRepository } from '../../modules/posts/infrastructure/posts.repository';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsBlgIdValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(private postsRepository: PostsRepository) {}

  async validate(blogId: Types.ObjectId): Promise<boolean> {
    const blog = await this.postsRepository.getGetBlog(blogId);
    if (!blog) return false;

    return true;
  }

  defaultMessage(): string {
    return 'blogId not found';
  }
}

export function ValidateBlogIdDecorator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserComment',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsBlgIdValidatorConstraint,
    });
  };
}
