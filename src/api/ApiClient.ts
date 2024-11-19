import AuthService, { UserNotFoundError } from '../services/AuthService';
import AuthSession from './AuthSession';
import HttpClient from '../utils/HttpClient';
import ClientService from '../services/ClientService';

export default class ApiClient extends HttpClient {
  protected readonly authService: AuthService;
  protected readonly clientService: ClientService;

  protected authSession: AuthSession | null;

  constructor(baseURL: string) {
    super(baseURL);

    this.authService = new AuthService(this);
    this.clientService = new ClientService(this);

    this.authSession = null;

    this.axiosInstance.interceptors.request.use(async (config) => {
      if (await this.validateAuthSession()) {
        config.headers.Authorization = `${this.authSession?.token}`;
      }

      return config;
    });
  }

  get isAuthorized(): boolean {
    return this.authSession !== null && this.authSession.isValid;
  }

  async authorize(userName: string) {
    let authSession = null;

    try {
      authSession = await this.authService.login(userName);
    } catch (error) {
      if (error instanceof UserNotFoundError)
        authSession = await this.authService.register(userName);
      else throw error;
    }

    this.authSession = authSession instanceof AuthSession ? authSession : null;
  }

  protected async validateAuthSession(): Promise<boolean> {
    if (this.authSession === null) {
      return false;
    }

    if (!this.authSession.isValid) {
      await this.authorize(this.authSession.userName);
    }

    return this.isAuthorized;
  }

  fetchClientsWithStatuses() {
    return this.clientService.fetchClientsWithStatuses();
  }
}
