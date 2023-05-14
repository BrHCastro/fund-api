import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { CreateUserDTO } from './dto/create-user.dto'
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'
import { UpdatePutUserDTO } from './dto/update-put-user.dto'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO) {
    if (await this.emailAlreadyExists(data.email)) {
      throw new BadRequestException('Email already exists')
    }

    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash(data.password, salt)

    const user = this.usersRepository.create(data)
    return this.usersRepository.save(user)
  }

  async getAll() {
    return await this.usersRepository.find({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async getById(id: string) {
    const user = this.usersRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async emailAlreadyExists(email: string) {
    return this.usersRepository.exist({
      where: { email: email },
    })
  }

  async update(id: string, data: UpdatePutUserDTO) {
    if (!(await this.getById(id))) {
      throw new NotFoundException(`User ${id} does not exist`)
    }

    const salt = await bcrypt.genSalt()

    const updated = {
      ...data,
      password: await bcrypt.hash(data.password, salt),
      updated_at: String(new Date()),
    }

    await this.usersRepository.update(id, updated)

    return { success: true }
  }

  async updatePartial(id: string, data: UpdatePatchUserDTO) {
    if (!(await this.getById(id))) {
      throw new NotFoundException(`User ${id} does not exist`)
    }

    if (data.password) {
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash(data.password, salt)
    }

    const updated = {
      ...data,
      updated_at: String(new Date()),
    }

    await this.usersRepository.update(id, updated)

    return { success: true }
  }

  async delete(id: string) {
    if (!(await this.getById(id))) {
      throw new NotFoundException(`User ${id} does not exist`)
    }

    await this.usersRepository.update(id, {
      deleted_at: String(new Date()),
    })

    return { success: true }
  }
}
