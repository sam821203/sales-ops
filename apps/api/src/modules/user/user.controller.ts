import type { Context } from 'hono';
import type { z } from 'zod';
import { createUserSchema } from './dto/create-user.dto.js';
import { userService } from './user.service.js';

export { createUserSchema };

type CreateBody = z.infer<typeof createUserSchema>;

export async function listUsersHandler(c: Context) {
  const limit = Number(c.req.query('limit')) || 50;
  const offset = Number(c.req.query('offset')) || 0;
  const list = await userService.getUsers(limit, offset);
  return c.json(list);
}

export async function getUserByIdHandler(c: Context) {
  const id = c.req.param('id');
  const userEntity = await userService.getUserById(id);
  if (!userEntity) {
    return c.json({ error: 'Not Found', message: 'User not found' }, 404);
  }
  return c.json(userEntity);
}

export async function createUserHandler(c: Context<object, string, { out: { json: CreateBody } }>) {
  const body = c.req.valid('json');
  const created = await userService.createUser(body);
  return c.json(created, 201);
}

export async function updateUserHandler(c: Context) {
  const id = c.req.param('id');
  const body = await c.req.json<{ name?: string }>().catch(() => ({}));
  const name = 'name' in body ? body.name : undefined;
  const updated = await userService.updateUser(id, { name });
  if (!updated) {
    return c.json({ error: 'Not Found', message: 'User not found' }, 404);
  }
  return c.json(updated);
}

export async function deleteUserHandler(c: Context) {
  const id = c.req.param('id');
  await userService.deleteUser(id);
  return c.body(null, 204);
}
