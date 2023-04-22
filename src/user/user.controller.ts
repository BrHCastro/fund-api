import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdatePutUserDTO } from './dto/update-put-user.dto'
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'
import { UserService } from './user.service'
import { ParamUUId } from '~/decorators/param-uuid.decorator'
import { Roles } from '~/decorators/roles.decorator'
import { Role } from '~/enums/role.enum'
import { RoleGuard } from '~/guards/role.guard'
import { AuthGuard } from '~/guards/auth.guard'
import { SkipThrottle } from '@nestjs/throttler'

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data)
  }

  @Get()
  async getAll() {
    return this.userService.getAll()
  }

  @SkipThrottle()
  @Get(':id')
  async getById(@ParamUUId() id: string) {
    return this.userService.getById(id)
  }

  @Put(':id')
  async update(
    @Body() { name, email, password, role }: UpdatePutUserDTO,
    @ParamUUId() id: string,
  ) {
    return this.userService.update(id, { name, email, password, role })
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchUserDTO,
    @ParamUUId() id: string,
  ) {
    return this.userService.updatePartial(id, data)
  }

  @Delete(':id')
  async delete(@ParamUUId() id: string) {
    return this.userService.delete(id)
  }
}
