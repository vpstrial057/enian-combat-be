import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<User> => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Request User:', request.user);
    return request.user;
  },
);
