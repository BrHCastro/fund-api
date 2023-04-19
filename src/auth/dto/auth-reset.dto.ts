import { IsJWT, IsStrongPassword } from 'class-validator'

export class AuthResetDTO {
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string

  @IsJWT()
  token: string
}
