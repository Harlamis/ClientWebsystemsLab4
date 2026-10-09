<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "../stores/users";
import type { User } from "../types/user";

const props = defineProps<{ id: string }>();
const usersStore = useUsersStore();

const user = ref<User | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    user.value = await usersStore.getUserById(Number(props.id));
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white p-8 rounded-xl shadow-md border border-gray-100">
    <div v-if="isLoading" class="text-center text-gray-500">
      Завантаження...
    </div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="user" class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <img
          :src="user.image || 'https://via.placeholder.com/100'"
          class="w-20 h-20 rounded-full border"
        />
        <div>
          <h1 class="text-2xl font-bold">
            {{ user.firstName }} {{ user.lastName }}
          </h1>
          <p class="text-gray-500">@{{ user.username }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4">
        <div><strong>Email:</strong> {{ user.email }}</div>
        <div><strong>Телефон:</strong> {{ user.phone }}</div>
        <div><strong>Вік:</strong> {{ user.age }}</div>
        <div><strong>Стать:</strong> {{ user.gender }}</div>
      </div>

      <div class="flex gap-4">
        <RouterLink
          :to="`/users/${user.id}/edit`"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Редагувати
        </RouterLink>
        <RouterLink
          to="/users"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
        >
          Назад до списку
        </RouterLink>
      </div>
    </div>
  </div>
</template>
