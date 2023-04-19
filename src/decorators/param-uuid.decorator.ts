import {
  ExecutionContext,
  ParseUUIDPipe,
  createParamDecorator,
} from '@nestjs/common'

export const ParamUUId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return new ParseUUIDPipe().transform(
      ctx.switchToHttp().getRequest().params.id,
      { type: 'param' },
    )
  },
)
