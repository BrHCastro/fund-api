import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { LogInterceptor } from './interceptors/log.interceptor'
import { env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new LogInterceptor())
  await app.listen(env.SERVER_PORT)
}
bootstrap()
