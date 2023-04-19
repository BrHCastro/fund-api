import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthLoginDTO } from './dto/auth-login.dto'
import { AuthRegisterDTO } from './dto/auth-register.dto'
import { AuthForgetDTO } from './dto/auth-forget.dto'
import { AuthResetDTO } from './dto/auth-reset.dto'
import { AuthService } from './auth.service'
import { AuthGuard } from '~/guards/auth.guard'
import { User } from '~/decorators/user.decorator'
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express'
import { join } from 'node:path'
import { FileService } from '~/file/file.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('sign-in')
  async signIn(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.signIn(email, password)
  }

  @Post('sign-up')
  async signUp(@Body() data: AuthRegisterDTO) {
    return this.authService.signUp(data)
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token)
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { user }
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('avatar')
  async avatarUpload(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 700, // 700kb,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileName = `avatar_${user.id}_${file.mimetype.replace('/', '.')}`
    const path = join(__dirname, '..', '..', 'storage', 'images', fileName)

    try {
      await this.fileService.upload(file, path)
    } catch (error) {
      throw new BadRequestException(error)
    }

    return { success: true }
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async filesUpload(
    @User() user,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 10,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('file-fields')
  async fileFieldsUpload(
    @User() user,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  ) {
    return files
  }
}
