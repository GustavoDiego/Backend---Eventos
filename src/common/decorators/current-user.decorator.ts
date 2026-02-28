import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para extrair o usuário autenticado da request.
 * Uso: @CurrentUser() user: JwtPayload
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
