import 'dotenv/config'
import { z } from 'zod'

/** Validate all envs. */

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_DATABASE: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number().default(3306),

  MAILER_HOST: z.string(),
  MAILER_PORT: z.coerce.number().default(587),
  MAILER_USER: z.string(),
  MAILER_PASS: z.string(),

  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  JWT_SECRET: z.string(),
  SERVER_PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables.', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
