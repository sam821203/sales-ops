import type { CreateUserInput } from './dto/create-user.dto.js';
import type { UserResponse } from './dto/user-response.dto.js';
import { toUserResponse } from './dto/user-response.dto.js';
import { userRepository } from './user.repository.js';

/**
 * Business logic only. No HTTP/framework types.
 */
export const userService = {
  async createUser(data: CreateUserInput): Promise<UserResponse> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      const error = new Error('User with this email already exists') as Error & { statusCode?: number };
      error.statusCode = 409;
      throw error;
    }
    const user = await userRepository.create(data);
    return toUserResponse(user);
  },

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await userRepository.findById(id);
    return user ? toUserResponse(user) : null;
  },

  async getUsers(limit = 50, offset = 0): Promise<UserResponse[]> {
    const users = await userRepository.findMany(limit, offset);
    return users.map(toUserResponse);
  },

  async updateUser(id: string, data: { name?: string }): Promise<UserResponse | null> {
    const user = await userRepository.update(id, data);
    return toUserResponse(user);
  },

  async deleteUser(id: string): Promise<boolean> {
    await userRepository.delete(id);
    return true;
  },
};
