import { defineStore } from "pinia";
import { ref } from "vue";
import type { User, CreateUserDto, UpdateUserDto } from "../types/user";
import { ServiceProvider } from "../services/service-provider";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async (page = 1, query = "", limit = 10) => {
    isLoading.value = true;
    error.value = null;
    const skip = (page - 1) * limit;

    try {
      const data = query.trim()
        ? await ServiceProvider.users.search(query, limit, skip)
        : await ServiceProvider.users.getAll({ limit, skip });

      users.value = data.users;
      total.value = data.total;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      isLoading.value = false;
    }
  };

  const getUserById = async (id: number): Promise<User> => {
    const existing = users.value.find((u) => u.id === id);
    if (existing) return existing;
    return await ServiceProvider.users.getById(id);
  };

  const addUser = async (data: CreateUserDto) => {
    const created = await ServiceProvider.users.create(data);
    const localUser: User = { ...created, id: Date.now() };
    users.value.unshift(localUser);
    total.value++;
    return localUser;
  };

  const updateUser = async (id: number, data: UpdateUserDto) => {
    const updated = await ServiceProvider.users.update(id, data);
    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updated };
    }
    return updated;
  };

  const deleteUser = async (id: number) => {
    await ServiceProvider.users.delete(id);
    users.value = users.value.filter((u) => u.id !== id);
    total.value--;
  };

  return {
    users,
    total,
    isLoading,
    error,
    fetchUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
  };
});
