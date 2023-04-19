import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

export class LogInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const initDate = Date.now()

    return next.handle().pipe(
      tap(() => {
        const request = ctx.switchToHttp().getRequest()

        console.log(`Method: ${request.method}${request.url}`)
        console.log(`Execução levou: ${Date.now() - initDate} milisegundos`)
      }),
    )
  }
}
