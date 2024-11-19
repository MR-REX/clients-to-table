import ApiClient from '../api/ApiClient';

import {
  Client,
  ClientsRequestParametersSchema,
  ClientStatus,
  ClientStatusesRequestSchema,
  ClientWithStatus,
} from '../schemas/ClientServiceSchemas';

export const MAX_CLIENTS_PER_REQUEST = 1000;

export class LimitExceededError extends Error {
  readonly parameter: string;
  readonly maxValue: number;

  constructor(parameter: string, maxValue: number) {
    super(`Maximum allowed limit for "${parameter}" parameter is ${maxValue}`);

    this.name = 'LimitExceededError';

    this.parameter = parameter;
    this.maxValue = maxValue;
  }
}

export default class ClientService {
  protected readonly apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getClients(offset: number = 0, limit: number = MAX_CLIENTS_PER_REQUEST): Promise<Client[]> {
    if (offset < 0) {
      throw new Error('Clients offset cannot be negative');
    }

    if (limit <= 0) {
      throw new Error('Clients limit should be greater than 0');
    }

    if (limit > MAX_CLIENTS_PER_REQUEST) {
      throw new LimitExceededError('limit', MAX_CLIENTS_PER_REQUEST);
    }

    const params = ClientsRequestParametersSchema.parse({
      offset,
      limit,
    });

    const { data: clients } = await this.apiClient.get<Client[]>('/clients', params);

    return clients;
  }

  async getClientStatuses(clientIds: number[] = []): Promise<ClientStatus[]> {
    if (clientIds.length < 1) {
      throw new Error('At least one client id must be specified');
    }

    const data = ClientStatusesRequestSchema.parse({ userIds: clientIds });
    const { data: clientStatuses } = await this.apiClient.post<ClientStatus[]>('/clients', data);

    return clientStatuses;
  }

  async *fetchClientsWithStatuses(): AsyncGenerator<ClientWithStatus> {
    let offset = 0;

    while (true) {
      const clients = await this.getClients(offset, MAX_CLIENTS_PER_REQUEST);

      if (clients.length < 1) {
        break;
      }

      const clientStatuses = await this.getClientStatuses(clients.map((client) => client.id));

      const clientStatusesMap = new Map(
        clientStatuses.map((clientStatus) => [clientStatus.id, clientStatus.status]),
      );

      const clientsWithStatuses = clients.map((client) => ({
        ...client,
        status: clientStatusesMap.get(client.id) || null,
      }));

      for (const clientWithStatus of clientsWithStatuses) {
        yield clientWithStatus;
      }

      offset += MAX_CLIENTS_PER_REQUEST;
    }
  }
}
