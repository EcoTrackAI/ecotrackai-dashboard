/**
 * Environment variable validation utility
 * Checks required environment variables at runtime
 */

export function validateEnv() {
  const required = {
    firebase: [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
    ],
    database: ["DATABASE_URL"],
  };

  const missing: string[] = [];

  // Check Firebase vars
  required.firebase.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  // Check Database vars
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    missing.push("DATABASE_URL or POSTGRES_URL");
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
}

export function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
