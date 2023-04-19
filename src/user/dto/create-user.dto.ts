import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator'
import { Role } from '~/enums/role.enum'

export class CreateUserDTO {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string

  @IsOptional()
  @IsEnum(Role)
  role: number
}
