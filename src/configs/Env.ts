import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

class MissingEnvironmentVariableError extends Error {
  constructor(variable: string) {
    super(`Missing environment variable: "${variable}"`);
    this.name = 'MissingEnvironmentVariableError';
  }
}

interface EnvironmentVariables {
  API_URL: string;
  USER_NAME: string;
}

function getEnvironmentVariable(key: keyof EnvironmentVariables): string {
  const value = process.env[key];

  if (!value) {
    throw new MissingEnvironmentVariableError(key);
  }

  return value;
}

export const ENV: EnvironmentVariables = {
  API_URL: getEnvironmentVariable('API_URL'),
  USER_NAME: getEnvironmentVariable('USER_NAME'),
} as const;
