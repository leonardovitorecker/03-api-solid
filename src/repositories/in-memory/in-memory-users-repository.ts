import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository {
  private items: User[] = [];
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((u) => u.email === email);
    if (!user) {
      return null;
    }
    return user;
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
  async findById(id: string): Promise<User | null> {
    const user = this.items.find((u) => u.id === id);
    if (!user) {
      return null;
    }
    return user;
  }
}
