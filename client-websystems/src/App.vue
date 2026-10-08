<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Participant } from "./types";
import WinnersList from "./components/WinnersList.vue";
import RegistrationForm from "./components/RegistrationForm.vue";
import ParticipantsTable from "./components/ParticipantsTable.vue";
import Modal from "./components/Modal.vue";
import BaseButton from "./components/BaseButton.vue";

const participants = ref<Participant[]>([]);
const winners = ref<Participant[]>([]);

const editingParticipant = ref<Participant | null>(null);
const deletingParticipant = ref<Participant | null>(null);

onMounted(() => {
  const saved = localStorage.getItem("vue_lottery_participants");
  if (saved) {
    try {
      participants.value = JSON.parse(saved);
    } catch {
      participants.value = [];
    }
  }
});

watch(
  participants,
  (newVal) => {
    localStorage.setItem("vue_lottery_participants", JSON.stringify(newVal));
  },
  { deep: true },
);

const availableCandidates = computed(() => {
  const winnerIds = new Set(winners.value.map((w) => w.id));
  return participants.value.filter((p) => !winnerIds.has(p.id));
});

const canSelectWinner = computed(() => {
  return winners.value.length < 3 && availableCandidates.value.length > 0;
});

const handleAddParticipant = (data: Omit<Participant, "id">) => {
  const newParticipant: Participant = {
    ...data,
    id: crypto.randomUUID(),
  };
  participants.value.push(newParticipant);
};

const handleSelectWinner = () => {
  if (!canSelectWinner.value) return;
  const candidates = availableCandidates.value;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  winners.value.push(candidates[randomIndex]);
};

const handleRemoveWinner = (id: string) => {
  winners.value = winners.value.filter((w) => w.id !== id);
};

const handleStartEdit = (participant: Participant) => {
  editingParticipant.value = { ...participant };
};

const handleSaveEdit = (data: Omit<Participant, "id">) => {
  if (!editingParticipant.value) return;

  const index = participants.value.findIndex(
    (p) => p.id === editingParticipant.value?.id,
  );
  if (index !== -1) {
    const updated = { ...data, id: editingParticipant.value.id };
    participants.value[index] = updated;

    const winnerIndex = winners.value.findIndex((w) => w.id === updated.id);
    if (winnerIndex !== -1) {
      winners.value[winnerIndex] = updated;
    }
  }

  editingParticipant.value = null;
};

const handleStartDelete = (participant: Participant) => {
  deletingParticipant.value = participant;
};

const handleConfirmDelete = () => {
  if (!deletingParticipant.value) return;

  const id = deletingParticipant.value.id;
  participants.value = participants.value.filter((p) => p.id !== id);
  winners.value = winners.value.filter((w) => w.id !== id);

  deletingParticipant.value = null;
};
</script>

<template>
  <div class="max-w-6xl mx-auto flex flex-col gap-6">
    <header
      class="text-center py-4 bg-white rounded-xl shadow-md border border-gray-100"
    >
      <h1 class="text-3xl font-extrabold text-indigo-600">Vue Lottery App</h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WinnersList
        :winners="winners"
        :can-select-winner="canSelectWinner"
        @select-winner="handleSelectWinner"
        @remove-winner="handleRemoveWinner"
      />

      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
          Реєстрація нового учасника
        </h2>
        <RegistrationForm
          :existing-participants="participants"
          @submit="handleAddParticipant"
        />
      </div>
    </div>

    <ParticipantsTable
      :participants="participants"
      @edit="handleStartEdit"
      @delete="handleStartDelete"
    />

    <Modal v-if="editingParticipant" @close="editingParticipant = null">
      <template #title>Редагування учасника</template>
      <template #body>
        <RegistrationForm
          :existing-participants="participants"
          :initial-data="editingParticipant"
          is-editing
          @submit="handleSaveEdit"
        />
      </template>
    </Modal>

    <Modal v-if="deletingParticipant" @close="deletingParticipant = null">
      <template #title>Підтвердження видалення</template>
      <template #body>
        <p class="text-gray-700">
          Ви дійсно бажаєте видалити учасника
          <strong>"{{ deletingParticipant.name }}"</strong>,
          <strong>"{{ deletingParticipant.email }}"</strong>?
        </p>
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="deletingParticipant = null"
          >Ні</BaseButton
        >
        <BaseButton variant="danger" @click="handleConfirmDelete"
          >Так</BaseButton
        >
      </template>
    </Modal>
  </div>
</template>
