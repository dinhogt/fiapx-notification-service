import { loadEnv } from './env';

const validEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  APP_ENV: 'test',
  PORT: '3004',
  LOG_LEVEL: 'info',
  DATABASE_URL: 'postgresql://notification_svc:change-me@localhost:5432/fiapx?schema=notification',
  AWS_REGION: 'us-east-1',
  AWS_ENDPOINT: 'http://localhost:4566',
  OTEL_SERVICE_NAME: 'notification-service',
  JWT_ISSUER: 'http://localhost:3001',
  JWT_AUDIENCE: 'fiapx-api',
  JWKS_URL: 'http://localhost:3001/.well-known/jwks.json',
  TRUST_GATEWAY_IP: 'false',
  NOTIFICATIONS_QUEUE_URL: 'http://localhost:4566/000000000000/fiapx-local-notifications',
  USER_CONTACTS_QUEUE_URL: 'http://localhost:4566/000000000000/fiapx-local-user-contacts',
  EMAIL_PROVIDER: 'smtp',
  EMAIL_FROM: 'noreply@example.com',
  SMTP_HOST: 'localhost',
};

describe('loadEnv', () => {
  it('parses a valid environment', () => {
    const env = loadEnv(validEnv);
    expect(env.PORT).toBe(3004);
    expect(env.EMAIL_PROVIDER).toBe('smtp');
  });

  it('fails when required values are missing', () => {
    expect(() => loadEnv({})).toThrow(/Invalid configuration/);
  });
});
