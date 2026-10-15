<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { UserForm } from "@/features/user-form";
import { useUsersStore, type User, type CreateUserDto } from "@/entities/user";

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore();
const toast = useToast();

const user = ref<User | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);

onMounted(async () => {
  try {
    user.value = await usersStore.getUserById(Number(props.id));
  } finally {
    isLoading.value = false;
  }
});

const handleSave = async (data: CreateUserDto) => {
  isSaving.value = true;
  try {
    await usersStore.updateUser(Number(props.id), data);
    toast.add({
      severity: "success",
      summary: "Успіх",
      detail: "Дані оновлено",
      life: 3000,
    });
    router.push("/users");
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Помилка",
      detail: (err as Error).message,
      life: 4000,
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto"
  >
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      Редагування користувача
    </h1>
    <div v-if="isLoading" class="text-center py-4">Завантаження...</div>
    <UserForm
      v-else
      :initial-data="user"
      is-editing
      :loading="isSaving"
      @submit="handleSave"
      @cancel="router.push('/users')"
    />
  </div>
</template>
