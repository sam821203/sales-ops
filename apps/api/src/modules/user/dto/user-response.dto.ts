import type { User } from '../../../../generated/prisma/client.js';
import type { UserResponse } from '@salesops/shared';

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
