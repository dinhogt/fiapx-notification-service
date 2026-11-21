import { z } from 'zod';

const booleanFromEnv = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

export const notificationEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['local', 'homolog', 'test']).default('local'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  DATABASE_URL: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_ENDPOINT: z.string().url().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional().or(z.literal('')),
  OTEL_SERVICE_NAME: z.string().min(1),
  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),
  JWKS_URL: z.string().url(),
  TRUST_GATEWAY_IP: booleanFromEnv,
  NOTIFICATIONS_QUEUE_URL: z.string().url(),
  USER_CONTACTS_QUEUE_URL: z.string().url(),
  EMAIL_PROVIDER: z.enum(['ses', 'smtp']).default('smtp'),
  EMAIL_FROM: z.string().email(),
  SMTP_HOST: z.string().min(1).optional(),
});

export type NotificationEnv = z.infer<typeof notificationEnvSchema>;

export function loadEnv(env: NodeJS.ProcessEnv = process.env): NotificationEnv {
  const result = notificationEnvSchema.safeParse(env);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid configuration: ${details}`);
  }
  return result.data;
}
