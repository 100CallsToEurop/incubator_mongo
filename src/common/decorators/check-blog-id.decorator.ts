import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PostsQueryRepository } from '../../modules/posts/api/queryRepository/posts.query.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsBlgIdValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async validate(blogId: string): Promise<boolean> {
    const blog = await this.postsQueryRepository.getBlogById(blogId);
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
