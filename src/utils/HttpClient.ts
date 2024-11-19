import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';

export interface HttpRequestOptions {
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export default class HttpClient {
  protected readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  protected request<T>(
    method: Method,
    endpoint: string,
    options?: HttpRequestOptions,
  ): Promise<AxiosResponse<T>> {
    const { data, params } = options || {};

    return this.axiosInstance.request<T>({
      method,
      url: endpoint,
      data,
      params,
    });
  }

  get<T>(endpoint: string, params?: Record<string, unknown>) {
    return this.request<T>('GET', endpoint, { params });
  }

  post<T>(endpoint: string, data?: Record<string, unknown>, params?: Record<string, unknown>) {
    return this.request<T>('POST', endpoint, { data, params });
  }
}
