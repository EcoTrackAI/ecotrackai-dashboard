/**
 * Environment variable utility
 * Provides helper to get environment variables with error handling
 */

export function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}
