import type { User } from '@prisma/client';

export type UserResponse = Pick<User, 'id' | 'email' | 'name' | 'createdAt'>;

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
