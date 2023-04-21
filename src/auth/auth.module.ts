import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { UserModule } from '~/user/user.module'
import { PrismaModule } from '~/prisma/prisma.module'
import { AuthService } from './auth.service'
import { FileModule } from '~/file/file.module'
import { env } from '~/env'

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    FileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
