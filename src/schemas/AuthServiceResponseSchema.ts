import { z } from 'zod';

export const AuthServiceResponseSchema = z.object({
  token: z.string(),
});

export type AuthServiceResponse = z.infer<typeof AuthServiceResponseSchema>;
