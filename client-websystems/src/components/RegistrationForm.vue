<script setup lang="ts">
import { reactive } from "vue";
import type { Participant } from "../types";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  existingParticipants: Participant[];
  initialData?: Participant;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", data: Omit<Participant, "id">): void;
}>();

const formData = reactive({
  name: props.initialData?.name || "",
  email: props.initialData?.email || "",
  phone: props.initialData?.phone || "",
  dateOfBirth: props.initialData?.dateOfBirth || "",
});

const errors = reactive({
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
});

const resetErrors = () => {
  errors.name = "";
  errors.email = "";
  errors.phone = "";
  errors.dateOfBirth = "";
};

const validate = (): boolean => {
  resetErrors();
  let isValid = true;

  if (!formData.name.trim()) {
    errors.name = "Ім'я є обов'язковим";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "Email є обов'язковим";
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Некоректний формат e-mail";
    isValid = false;
  } else {
    const isDuplicate = props.existingParticipants.some((p) => {
      if (
        props.isEditing &&
        props.initialData &&
        p.id === props.initialData.id
      ) {
        return false;
      }
      return p.email.toLowerCase() === formData.email.toLowerCase();
    });

    if (isDuplicate) {
      errors.email = "Учасник з таким e-mail вже існує";
      isValid = false;
    }
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (!formData.phone.trim()) {
    errors.phone = "Телефон є обов'язковим";
    isValid = false;
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = "Формат повинен бути +380XXXXXXXXX";
    isValid = false;
  }

  if (!formData.dateOfBirth) {
    errors.dateOfBirth = "Дата народження є обов'язковою";
    isValid = false;
  } else {
    const selectedDate = new Date(formData.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      errors.dateOfBirth = "Дата народження не може бути у майбутньому";
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    emit("submit", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
    });
    if (!props.isEditing) {
      formData.name = "";
      formData.email = "";
      formData.phone = "";
      formData.dateOfBirth = "";
      resetErrors();
    }
  }
};
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <BaseInput
      id="name"
      v-model="formData.name"
      label="ПІБ"
      placeholder="Іван Іванов"
      :error="errors.name"
    />
    <BaseInput
      id="email"
      v-model="formData.email"
      type="email"
      label="Email"
      placeholder="example@mail.com"
      :error="errors.email"
    />
    <BaseInput
      id="phone"
      v-model="formData.phone"
      type="tel"
      label="Телефон"
      placeholder="+380991234567"
      :error="errors.phone"
    />
    <BaseInput
      id="dateOfBirth"
      v-model="formData.dateOfBirth"
      type="date"
      label="Дата народження"
      :error="errors.dateOfBirth"
    />
    <BaseButton type="submit" class="mt-2 w-full">
      {{ isEditing ? "Оновити дані" : "Save" }}
    </BaseButton>
  </form>
</template>
