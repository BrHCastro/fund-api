import { DataSource } from 'typeorm'
import { env } from '../src/env'

const dataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  migrations: [`${__dirname}/migrations/**/*.ts`],
})

export default dataSource
