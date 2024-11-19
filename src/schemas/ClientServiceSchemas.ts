import { z } from 'zod';
import { MAX_CLIENTS_PER_REQUEST } from '../services/ClientService';

export const ClientsRequestParametersSchema = z.object({
  offset: z.number().nonnegative(),
  limit: z.number().nonnegative().max(MAX_CLIENTS_PER_REQUEST),
});

export const ClientSchema = z.object({
  id: z.number().nonnegative(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(['male', 'female']),
  address: z.string(),
  city: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

export type Client = z.infer<typeof ClientSchema>;

export const ClientStatusesRequestSchema = z.object({
  userIds: z.array(z.number().nonnegative()),
});

export const ClientStatusSchema = z.object({
  id: z.number().nonnegative(),
  status: z.string(),
});

export type ClientStatus = z.infer<typeof ClientStatusSchema>;

export type ClientWithStatus = Client | ClientStatus;
