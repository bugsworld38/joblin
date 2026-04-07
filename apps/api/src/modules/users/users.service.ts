import { Injectable } from '@nestjs/common';

import type { User } from './interfaces';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async findById(id: string) {
    return this.usersRepo.findOne({ id });
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ email });
  }

  async create(user: Partial<User>) {
    return this.usersRepo.create(user);
  }
}
