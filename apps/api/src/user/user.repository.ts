import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';

import type { CreateUserData, User } from './interfaces';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from './queries/users.queries';

@Injectable()
export class UserRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<User | undefined> {
    const [user] = await findUserById.run({ id }, this.pool);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await findUserByEmail.run({ email }, this.pool);
    return user;
  }

  async create(data: CreateUserData): Promise<User> {
    const [user] = await createUser.run(data, this.pool);
    return user;
  }
}
