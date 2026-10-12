<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "../stores/users";
import type { User } from "../types/user";
import Modal from "../components/Modal.vue";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const currentPage = computed(() => Number(route.query.page) || 1);
const searchQuery = computed(() => (route.query.q as string) || "");

const searchInput = ref(searchQuery.value);
const selectedWinners = ref<User[]>([]);
const userToDelete = ref<User | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const loadData = () => {
  usersStore.fetchUsers(currentPage.value, searchQuery.value);
};

onMounted(loadData);

watch([() => route.query.page, () => route.query.q], loadData);

watch(searchInput, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    router.push({
      query: { ...route.query, q: newVal || undefined, page: 1 },
    });
  }, 300);
});

const setPage = (page: number) => {
  router.push({
    query: { ...route.query, page },
  });
};

const totalPages = computed(() => Math.ceil(usersStore.total / 10) || 1);

const canAddWinner = computed(() => {
  return (
    selectedWinners.value.length < 3 &&
    usersStore.users.length > selectedWinners.value.length
  );
});

const addRandomWinner = () => {
  if (!canAddWinner.value) return;
  const winnerIds = new Set(selectedWinners.value.map((w) => w.id));
  const candidates = usersStore.users.filter((u) => !winnerIds.has(u.id));
  if (candidates.length) {
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    selectedWinners.value.push(random);
  }
};

const removeWinner = (id: number) => {
  selectedWinners.value = selectedWinners.value.filter((w) => w.id !== id);
};

const handleDelete = (user: User) => {
  userToDelete.value = user;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  const id = userToDelete.value.id;
  await usersStore.deleteUser(id);
  removeWinner(id);
  userToDelete.value = null;
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <div
      class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-4"
    >
      <div class="flex justify-between items-center border-b pb-3">
        <h2 class="text-xl font-bold text-gray-800">
          Переможці ({{ selectedWinners.length }}/3)
        </h2>
        <button
          :disabled="!canAddWinner"
          class="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 disabled:opacity-50"
          @click="addRandomWinner"
        >
          New winner
        </button>
      </div>

      <div
        v-if="selectedWinners.length === 0"
        class="text-gray-400 text-center py-4"
      >
        Переможців ще не обрано
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          v-for="w in selectedWinners"
          :key="w.id"
          class="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between"
        >
          <div>
            <p class="font-bold text-sm">{{ w.firstName }} {{ w.lastName }}</p>
            <p class="text-xs text-gray-500">{{ w.email }}</p>
          </div>
          <button
            class="text-red-600 text-xs font-bold"
            @click="removeWinner(w.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div
      class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-4"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800">Учасники лотереї</h2>
        <input
          v-model="searchInput"
          type="text"
          placeholder="Пошук учасників..."
          class="px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
        />
      </div>

      <div v-if="usersStore.isLoading" class="text-center py-8 text-gray-500">
        Завантаження даних...
      </div>

      <div v-else-if="usersStore.error" class="text-center py-8 text-red-600">
        Помилка: {{ usersStore.error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase"
            >
              <th class="py-3 px-4">Користувач</th>
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Телефон</th>
              <th class="py-3 px-4">Вік</th>
              <th class="py-3 px-4 text-center">Дії</th>
            </tr>
          </thead>
          <tbody class="divide-y text-sm">
            <tr
              v-for="u in usersStore.users"
              :key="u.id"
              class="hover:bg-gray-50"
            >
              <td class="py-3 px-4 font-medium">
                <RouterLink
                  :to="`/users/${u.id}`"
                  class="text-indigo-600 hover:underline"
                >
                  {{ u.firstName }} {{ u.lastName }}
                </RouterLink>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ u.email }}</td>
              <td class="py-3 px-4 text-gray-600">{{ u.phone }}</td>
              <td class="py-3 px-4 text-gray-600">{{ u.age }}</td>
              <td class="py-3 px-4 text-center flex justify-center gap-2">
                <RouterLink
                  :to="`/users/${u.id}/edit`"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
                >
                  Редагувати
                </RouterLink>
                <button
                  class="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                  @click="handleDelete(u)"
                >
                  Видалити
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center pt-4 border-t">
        <button
          :disabled="currentPage <= 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="setPage(currentPage - 1)"
        >
          Назад
        </button>
        <span class="text-sm text-gray-600">
          Сторінка {{ currentPage }} з {{ totalPages }}
        </span>
        <button
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="setPage(currentPage + 1)"
        >
          Вперед
        </button>
      </div>
    </div>
  </div>

  <Modal v-if="userToDelete" @close="userToDelete = null">
    <template #title>Підтвердження видалення</template>
    <template #body>
      Ви дійсно бажаєте видалити учасника {{ userToDelete.firstName }}
      {{ userToDelete.lastName }}?
    </template>
    <template #footer>
      <button
        class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200"
        @click="userToDelete = null"
      >
        Скасувати
      </button>
      <button
        class="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        @click="confirmDelete"
      >
        Видалити
      </button>
    </template>
  </Modal>
</template>
