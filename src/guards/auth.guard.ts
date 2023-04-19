import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from '~/auth/auth.service'
import { UserService } from '~/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest()
    const { authorization } = request.headers

    try {
      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      )
      request.tokenPayload = data
      request.user = await this.userService.getById(data.sub)
      return true
    } catch (error) {
      return false
    }
  }
}
