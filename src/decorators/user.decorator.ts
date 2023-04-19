import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common'

export const User = createParamDecorator(
  (filter: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    if (!request.user) {
      throw new NotFoundException('User not found. AuthGuard is required.')
    }

    if (filter) {
      return request.user[filter]
    }

    return request.user
  },
)
