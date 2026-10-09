import { http } from "../api/http-client";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UsersResponse,
} from "../types/user";
import type { Readable, Creatable, Editable, Deletable } from "./interfaces";

export class UserService
  implements
    Readable<User, UsersResponse>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll({
    limit = 10,
    skip = 0,
  }: { limit?: number; skip?: number } = {}): Promise<UsersResponse> {
    return http<UsersResponse>(`/users?limit=${limit}&skip=${skip}`);
  }

  async search(query: string, limit = 10, skip = 0): Promise<UsersResponse> {
    return http<UsersResponse>(
      `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
    );
  }

  async getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`);
  }

  async create(data: CreateUserDto): Promise<User> {
    return http<User>("/users/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: "DELETE" });
  }
}
