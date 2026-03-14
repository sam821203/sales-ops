import { z } from 'zod';
import type { User } from '../../../../generated/prisma/client.js';

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.string(),
});

export const listUsersResponseSchema = z.array(userResponseSchema);

export type UserResponse = z.infer<typeof userResponseSchema>;

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
