import { isAxiosError } from 'axios';
import ApiClient from '../api/ApiClient';
import AuthSession from '../api/AuthSession';
import { HTTP_STATUS } from '../helpers/HttpStatus';

export type AuthServiceResponse = {
  token: string;
};

export class AuthorizationError extends Error {
  public readonly userName: string;
  public readonly statusCode: number;

  constructor(userName: string, statusCode: number, message?: string) {
    super(message || 'User authorization failed');

    this.name = this.constructor.name;

    this.userName = userName;
    this.statusCode = statusCode;
  }
}

export class UserAlreadyExistsError extends AuthorizationError {
  constructor(userName: string, statusCode: number = HTTP_STATUS.UNAUTHORIZED) {
    super(userName, statusCode, `User with name "${userName}" already exists`);
  }
}

export class UserNotFoundError extends AuthorizationError {
  constructor(userName: string, statusCode: number = HTTP_STATUS.UNAUTHORIZED) {
    super(userName, statusCode, `User with name "${userName}" not found`);
  }
}

export default class AuthService {
  protected readonly apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async register(userName: string): Promise<AuthSession> {
    try {
      const response = await this.apiClient.post<AuthServiceResponse>('/auth/registration', {
        username: userName,
      });

      return new AuthSession(response.data.token);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          throw new UserAlreadyExistsError(userName, error.response.status);
        }
      }

      throw error;
    }
  }

  async login(userName: string): Promise<AuthSession | null> {
    try {
      const response = await this.apiClient.post<AuthServiceResponse>('/auth/login', {
        username: userName,
      });

      return new AuthSession(response.data.token);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          throw new UserNotFoundError(userName);
        }
      }

      throw error;
    }
  }
}
