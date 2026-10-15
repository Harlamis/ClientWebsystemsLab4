<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AppButton } from "@/shared/ui";
import { useUsersStore, type User } from "@/entities/user";

const props = defineProps<{ id: string }>();
const router = useRouter();
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
  <div
    class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto"
  >
    <div
      v-if="isLoading"
      class="text-center py-8 text-gray-500"
    >
      Завантаження...
    </div>
    <div
      v-else-if="error"
      class="text-center py-8 text-red-600"
    >
      {{ error }}
    </div>
    <div
      v-else-if="user"
      class="flex flex-col gap-6"
    >
      <div class="flex items-center gap-4">
        <img
          :src="user.image || 'https://via.placeholder.com/100'"
          class="w-20 h-20 rounded-full border border-gray-200 dark:border-gray-600"
          alt="User Avatar"
        >
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ user.firstName }} {{ user.lastName }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400">
            @{{ user.username }}
          </p>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-gray-200 dark:border-gray-700 py-4 text-gray-700 dark:text-gray-300"
      >
        <div><strong>Email:</strong> {{ user.email }}</div>
        <div><strong>Телефон:</strong> {{ user.phone }}</div>
        <div><strong>Вік:</strong> {{ user.age }}</div>
        <div><strong>Стать:</strong> {{ user.gender }}</div>
      </div>

      <div class="flex gap-3">
        <RouterLink :to="`/users/${user.id}/edit`">
          <AppButton label="Редагувати" />
        </RouterLink>
        <AppButton
          label="Назад до списку"
          severity="secondary"
          @click="router.push('/users')"
        />
      </div>
    </div>
  </div>
</template>
