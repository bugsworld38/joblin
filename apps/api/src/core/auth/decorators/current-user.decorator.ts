import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

import { User } from '@modules/users/interfaces';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

const getCurrentUserByContext = (context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest<Request & { user: User }>();

  return request.user;
};
