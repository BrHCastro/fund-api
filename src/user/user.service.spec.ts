import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { userRepositoryMock } from '../testing/user-repository.mock'
import { userEntityList } from '../testing/user-entity-list.mock'
import { createUserDTO } from '../testing/create-user-dto.mock'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('UserService', () => {
  let userService: UserService
  let userRepository: Repository<UserEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get(getRepositoryToken(UserEntity))
  })

  it('should be definited', () => {
    expect(userService).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('Create', () => {
    it('should be possible to create a new user', async () => {
      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false)

      const result = await userService.create(createUserDTO)
      expect(result.name).toEqual(userEntityList[0].name)
      expect(result.email).toEqual(userEntityList[0].email)
      expect(result.password).toEqual(userEntityList[0].password)
    })
  })

  describe('Read', () => {
    it('should be able to read all users', async () => {
      const result = await userService.getAll()
      expect(result).toEqual(userEntityList)
    })

    it('should be able to read one user by id', async () => {
      const result = await userService.getById('1')
      expect(result).toEqual(userEntityList[0])
    })
  })

  // describe('Updaet', () => {})

  // describe('Delete', () => {})
})
