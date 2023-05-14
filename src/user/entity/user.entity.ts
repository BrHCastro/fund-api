import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Role } from '../../enums/role.enum'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date

  @Column({ nullable: true, default: Role.User })
  role?: number
}
