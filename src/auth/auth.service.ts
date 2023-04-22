import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { AuthRegisterDTO } from './dto/auth-register.dto'
import { UserService } from '~/user/user.service'
import { MailerService } from '@nestjs-modules/mailer'
import { UserEntity } from '~/user/entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  private issuer = 'sign in'
  private audience = 'user'

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    }
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      })

      return data
    } catch (error) {
      throw new ForbiddenException(error.message)
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token)
      return true
    } catch {
      return false
    }
  }

  async signUp(data: AuthRegisterDTO) {
    const user = await this.userService.create(data)
    return this.createToken(user)
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect')
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email or password incorrect')
    }

    return this.createToken(user)
  }

  async forget(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new NotFoundException('Email not found')
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '25 minutes',
        subject: user.id,
        issuer: 'forget',
        audience: 'users',
      },
    )
    await this.mailerService.sendMail({
      subject: 'Password recovery',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    })

    return true
  }

  async reset(password: string, token: string) {
    try {
      const { id } = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      })
      const salt = await bcrypt.genSalt()
      await this.usersRepository.update(id, {
        password: await bcrypt.hash(password, salt),
      })

      const user = await this.userService.getById(id)

      return this.createToken(user)
    } catch (error) {
      throw new ForbiddenException(error.message)
    }
  }
}
