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
import { WinnersList } from "@/widgets/winners-list";
import { useUsersStore, type User } from "@/entities/user";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const confirm = useConfirm();
const toast = useToast();

const { users, total, isLoading, winners, canSelectWinner } =
  storeToRefs(usersStore);

const limit = 10;
const currentPage = computed(() => Number(route.query.page) || 1);
const searchQuery = computed(() => (route.query.q as string) || "");
const searchInput = ref(searchQuery.value);

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));

const columns: ColumnDef[] = [
  { field: "firstName", header: "Ім'я", sortable: true },
  { field: "lastName", header: "Прізвище", sortable: true },
  { field: "email", header: "Email" },
  { field: "phone", header: "Телефон" },
  { field: "age", header: "Вік", sortable: true },
];

const loadData = () => {
  usersStore.fetchUsers(currentPage.value, searchQuery.value, limit);
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

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  router.push({ query: { ...route.query, page } });
};

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

const handleSelectWinner = () => {
  usersStore.selectRandomWinner();
  toast.add({
    severity: "success",
    summary: "Переможець обраний!",
    detail: "Новий переможець доданий у блок",
    life: 3000,
  });
};

const handleRemoveWinner = (id: number) => {
  usersStore.removeWinner(id);
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <AppConfirmDialog />

    <WinnersList
      :winners="winners"
      :can-select-winner="canSelectWinner"
      @select-winner="handleSelectWinner"
      @remove-winner="handleRemoveWinner"
    />

    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition-colors"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white">
            Список учасників
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Всього користувачів: {{ total }}
          </p>
        </div>
        <div class="w-full sm:w-64">
          <AppInput v-model="searchInput" placeholder="Пошук за ім'ям..." />
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

      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm"
      >
        <span class="text-gray-600 dark:text-gray-400">
          Сторінка <strong>{{ currentPage }}</strong> з
          <strong>{{ totalPages }}</strong>
        </span>

        <div class="flex items-center gap-2">
          <AppButton
            label="← Назад"
            size="small"
            severity="secondary"
            :disabled="currentPage <= 1 || isLoading"
            @click="goToPage(currentPage - 1)"
          />

          <div class="hidden md:flex gap-1 overflow-x-auto max-w-xs p-1">
            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              :class="[
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                p === currentPage
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
              ]"
              @click="goToPage(p)"
            >
              {{ p }}
            </button>
          </div>

          <AppButton
            label="Вперед →"
            size="small"
            severity="secondary"
            :disabled="currentPage >= totalPages || isLoading"
            @click="goToPage(currentPage + 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
