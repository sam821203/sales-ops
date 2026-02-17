import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createUserSchema } from './dto/create-user.dto.js';
import { userService } from './user.service.js';

const user = new Hono();

// GET    /users
user.get('/', async (c) => {
  const limit = Number(c.req.query('limit')) || 50;
  const offset = Number(c.req.query('offset')) || 0;
  const list = await userService.getUsers(limit, offset);
  return c.json(list);
});

// GET    /users/:id
user.get('/:id', async (c) => {
  const id = c.req.param('id');
  const userEntity = await userService.getUserById(id);
  if (!userEntity) {
    return c.json({ error: 'Not Found', message: 'User not found' }, 404);
  }
  return c.json(userEntity);
});

// POST   /users
user.post('/', zValidator('json', createUserSchema), async (c) => {
  const body = c.req.valid('json');
  const created = await userService.createUser(body);
  return c.json(created, 201);
});

// PATCH  /users/:id
user.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ name?: string }>().catch(() => ({}));
  const name = 'name' in body ? body.name : undefined;
  const updated = await userService.updateUser(id, { name });
  if (!updated) {
    return c.json({ error: 'Not Found', message: 'User not found' }, 404);
  }
  return c.json(updated);
});

// DELETE /users/:id
user.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await userService.deleteUser(id);
  return c.body(null, 204);
});

export { user as userController };
