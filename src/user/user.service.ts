import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '~/prisma/prisma.service'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'
import { UpdatePutUserDTO } from './dto/update-put-user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    if (await this.getByEmail(data.email)) {
      throw new BadRequestException('Email already exists')
    }

    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash(data.password, salt)

    return this.prisma.user.create({
      data,
    })
  }

  async getAll() {
    return this.prisma.user.findMany({
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
    return this.prisma.user.findUnique({
      where: {
        id,
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

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
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

  async update(id: string, data: UpdatePutUserDTO) {
    if (!(await this.getById(id))) {
      throw new NotFoundException(`User ${id} does not exist`)
    }

    const salt = await bcrypt.genSalt()

    const updated = {
      ...data,
      password: await bcrypt.hash(data.password, salt),
      updated_at: new Date(),
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: updated,
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
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
      updated_at: new Date(),
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: updated,
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
  }

  async delete(id: string) {
    if (!(await this.getById(id))) {
      throw new NotFoundException(`User ${id} does not exist`)
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: {
        id: true,
        deleted_at: true,
      },
    })
  }
}
