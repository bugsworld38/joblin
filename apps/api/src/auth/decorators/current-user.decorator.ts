import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { User } from '@user/interfaces';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

const getCurrentUserByContext = (context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest<Request & { user: User }>();

  return request.user;
};
