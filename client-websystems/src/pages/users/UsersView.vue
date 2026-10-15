<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { storeToRefs } from "pinia";
import {
  AppButton,
  AppInput,
  AppTable,
  AppConfirmDialog,
  type ColumnDef,
} from "@/shared/ui";
import { useUsersStore, type User } from "@/entities/user";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const confirm = useConfirm();
const toast = useToast();

const { users, total, isLoading } = storeToRefs(usersStore);

const currentPage = computed(() => Number(route.query.page) || 1);
const searchQuery = computed(() => (route.query.q as string) || "");
const searchInput = ref(searchQuery.value);

const columns: ColumnDef[] = [
  { field: "firstName", header: "Ім'я", sortable: true },
  { field: "lastName", header: "Прізвище", sortable: true },
  { field: "email", header: "Email" },
  { field: "phone", header: "Телефон" },
  { field: "age", header: "Вік", sortable: true },
];

const loadData = () => {
  usersStore.fetchUsers(currentPage.value, searchQuery.value);
};

onMounted(loadData);
watch([() => route.query.page, () => route.query.q], loadData);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(searchInput, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    router.push({ query: { ...route.query, q: newVal || undefined, page: 1 } });
  }, 300);
});

const handleDelete = (user: User) => {
  confirm.require({
    message: `Ви дійсно бажаєте видалити користувача ${user.firstName} ${user.lastName}?`,
    header: "Підтвердження видалення",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Так",
    rejectLabel: "Ні",
    acceptClass: "p-button-danger",
    accept: async () => {
      await usersStore.removeUser(user.id);
      toast.add({
        severity: "info",
        summary: "Видалено",
        detail: "Користувача видалено",
        life: 3000,
      });
    },
  });
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <AppConfirmDialog />
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col gap-4"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
          Список учасників ({{ total }})
        </h2>
        <div class="w-full sm:w-64">
          <AppInput v-model="searchInput" placeholder="Пошук..." />
        </div>
      </div>

      <AppTable :value="users" :columns="columns" :loading="isLoading">
        <template #firstName="{ data }">
          <RouterLink
            :to="`/users/${data.id}`"
            class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            {{ data.firstName }}
          </RouterLink>
        </template>
        <template #actions>
          <Column header="Дії" class="text-center">
            <template #body="{ data }">
              <div class="flex justify-center gap-2">
                <RouterLink :to="`/users/${data.id}/edit`">
                  <AppButton
                    label="Редагувати"
                    size="small"
                    severity="secondary"
                  />
                </RouterLink>
                <AppButton
                  label="Видалити"
                  size="small"
                  severity="danger"
                  @click="handleDelete(data)"
                />
              </div>
            </template>
          </Column>
        </template>
      </AppTable>
    </div>
  </div>
</template>
