import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RULES_KEY } from '~/decorators/roles.decorator'
import { Role } from '~/enums/role.enum'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(RULES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const { user } = ctx.switchToHttp().getRequest()
    const rolesFiltered = requiredRoles.filter((role) => role === user.role)

    return rolesFiltered.length > 0
  }
}
