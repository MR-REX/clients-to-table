import { z } from 'zod';

export const JwtPayloadSchema = z.object({
  username: z.string().min(1),
  id: z.number().nonnegative(),
  iat: z.number().nonnegative(),
  exp: z.number().nonnegative(),
});
