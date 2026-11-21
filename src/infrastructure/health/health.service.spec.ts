import { HealthService } from './health.service';
import type { NotificationEnv } from '../config/env';

const env: NotificationEnv = {
  NODE_ENV: 'test',
  APP_ENV: 'test',
  PORT: 3004,
  LOG_LEVEL: 'info',
  DATABASE_URL: 'postgresql://notification_svc:change-me@127.0.0.1:1/fiapx?schema=notification',
  AWS_REGION: 'us-east-1',
  AWS_ENDPOINT: 'http://127.0.0.1:1',
  AWS_ACCESS_KEY_ID: 'test',
  AWS_SECRET_ACCESS_KEY: 'test',
  OTEL_SERVICE_NAME: 'notification-service',
  JWT_ISSUER: 'http://localhost:3001',
  JWT_AUDIENCE: 'fiapx-api',
  JWKS_URL: 'http://localhost:3001/.well-known/jwks.json',
  TRUST_GATEWAY_IP: false,
  NOTIFICATIONS_QUEUE_URL: 'http://127.0.0.1:1/000000000000/fiapx-local-notifications',
  USER_CONTACTS_QUEUE_URL: 'http://127.0.0.1:1/000000000000/fiapx-local-user-contacts',
  EMAIL_PROVIDER: 'smtp',
  EMAIL_FROM: 'noreply@example.com',
  SMTP_HOST: 'localhost',
};

describe('HealthService', () => {
  it('reports live status without dependencies', () => {
    expect(new HealthService(env).live()).toEqual({ status: 'ok' });
  });

  it('marks ready as false when dependencies are unreachable', async () => {
    const result = await new HealthService(env).ready();
    expect(result.ready).toBe(false);
    expect(result.checks.map((check) => check.name).sort()).toEqual([
      'postgres',
      'sqs-notifications',
      'sqs-user-contacts',
    ]);
  }, 10000);
});
