import type { CreateUserInput } from './dto/create-user.dto.js';
import { prisma } from '../../lib/prisma.js';

/**
 * Data access only. No business logic; all SQL/ORM here.
 */
export const userRepository = {
  async create(data: CreateUserInput) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name ?? null,
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findMany(limit = 50, offset = 0) {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: { name?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
