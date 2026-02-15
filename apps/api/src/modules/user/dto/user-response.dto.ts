import type { User } from '@prisma/client';
import type { UserResponse } from '@salesops/shared';

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
