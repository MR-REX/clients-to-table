export class MissingEnvironmentVariableError extends Error {
  constructor(variable: string) {
    super(`Missing environment variable: "${variable}"`);
    this.name = 'MissingEnvironmentVariableError';
  }
}

export function getEnvironmentVariable(variable: string): string {
  const value = process.env[variable];

  if (!value) {
    throw new MissingEnvironmentVariableError(variable);
  }

  return value;
}
