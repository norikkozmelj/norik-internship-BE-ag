import { applyDecorators } from '@nestjs/common';
import {
  Documentation,
  GramNum,
  HttpMethodKey,
} from '../../../decorator/documentation.decorator';
import { User } from '../user.entity';

export function PostUserDocumentation(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Documentation(HttpMethodKey.POST, 'user', User, GramNum.SINGULAR),
  );
}
