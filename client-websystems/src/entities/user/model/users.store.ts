import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ServiceProvider } from "@/shared/api";
import type { UserService } from "../api/user.service";
import type { User, CreateUserDto, UpdateUserDto } from "./types";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const hasUsers = computed(() => users.value.length > 0);

  const userService = () => ServiceProvider.get<UserService>("users");

  async function fetchUsers(page = 1, query = "", limit = 10) {
    isLoading.value = true;
    error.value = null;
    const skip = (page - 1) * limit;

    try {
      const data = query.trim()
        ? await userService().search(query, limit, skip)
        : await userService().getAll({ limit, skip });

      users.value = data.users;
      total.value = data.total;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      isLoading.value = false;
    }
  }

  async function getUserById(id: number): Promise<User> {
    const existing = users.value.find((u) => u.id === id);
    if (existing) return existing;
    return await userService().getById(id);
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const created = await userService().create(data);
    const localUser: User = { ...created, id: Date.now() };
    users.value.unshift(localUser);
    total.value++;
    return localUser;
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const updated = await userService().update(id, data);
    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updated };
    }
    return updated;
  }

  async function removeUser(id: number): Promise<void> {
    await userService().delete(id);
    users.value = users.value.filter((u) => u.id !== id);
    total.value--;
  }

  return {
    users,
    total,
    isLoading,
    error,
    hasUsers,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    removeUser,
  };
});
