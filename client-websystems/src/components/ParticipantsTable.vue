<script setup lang="ts">
import { ref, computed } from "vue";
import type { Participant, SortField, SortOrder } from "../types";
import SearchBar from "./SearchBar.vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  participants: Participant[];
}>();

defineEmits<{
  (e: "edit", participant: Participant): void;
  (e: "delete", participant: Participant): void;
}>();

const searchQuery = ref("");
const sortField = ref<SortField>(null);
const sortOrder = ref<SortOrder>("asc");

const handleFilter = (query: string) => {
  searchQuery.value = query;
};

const toggleSort = (field: "name" | "dateOfBirth") => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

const processedParticipants = computed(() => {
  let result = [...props.participants];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (sortField.value) {
    const field = sortField.value;
    const order = sortOrder.value === "asc" ? 1 : -1;

    result.sort((a, b) => {
      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });
  }

  return result;
});
</script>

<template>
  <div
    class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-4"
  >
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <h2 class="text-xl font-bold text-gray-800">Список учасників</h2>
      <SearchBar @filter-by-name="handleFilter" />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            <th
              class="py-3 px-4 cursor-pointer select-none"
              @click="toggleSort('name')"
            >
              <div class="flex items-center gap-1">
                Ім'я
                <span v-if="sortField === 'name'">{{
                  sortOrder === "asc" ? "▲" : "▼"
                }}</span>
                <span v-else class="text-gray-300">⇅</span>
              </div>
            </th>
            <th class="py-3 px-4">Email</th>
            <th class="py-3 px-4">Телефон</th>
            <th
              class="py-3 px-4 cursor-pointer select-none"
              @click="toggleSort('dateOfBirth')"
            >
              <div class="flex items-center gap-1">
                Дата народження
                <span v-if="sortField === 'dateOfBirth'">{{
                  sortOrder === "asc" ? "▲" : "▼"
                }}</span>
                <span v-else class="text-gray-300">⇅</span>
              </div>
            </th>
            <th class="py-3 px-4 text-center">Редагування</th>
            <th class="py-3 px-4 text-center">Видалення</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr v-if="processedParticipants.length === 0">
            <td colspan="6" class="py-6 text-center text-gray-400">
              Учасників не знайдено
            </td>
          </tr>
          <tr
            v-for="p in processedParticipants"
            :key="p.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 font-medium text-gray-900">{{ p.name }}</td>
            <td class="py-3 px-4 text-gray-600">{{ p.email }}</td>
            <td class="py-3 px-4 text-gray-600">{{ p.phone }}</td>
            <td class="py-3 px-4 text-gray-600">{{ p.dateOfBirth }}</td>
            <td class="py-3 px-4 text-center">
              <BaseButton
                variant="secondary"
                class="!px-2 !py-1 text-xs"
                @click="$emit('edit', p)"
              >
                Редагувати дані
              </BaseButton>
            </td>
            <td class="py-3 px-4 text-center">
              <BaseButton
                variant="danger"
                class="!px-2 !py-1 text-xs"
                @click="$emit('delete', p)"
              >
                Видалити учасника
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
