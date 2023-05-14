import { Role } from '../enums/role.enum'
import { CreateUserDTO } from '../user/dto/create-user.dto'

export const createUserDTO: CreateUserDTO = {
  name: 'John Doe',
  email: 'john@doe.com',
  password: '$2b$10$7ijp9X2xWEFU93RRMrqrUeomFqUUlPMPXYA5icDK4N3B71sykKmpC',
  role: Role.User,
}
