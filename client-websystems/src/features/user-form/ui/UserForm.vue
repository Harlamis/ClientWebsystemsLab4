<script setup lang="ts">
import { onMounted } from "vue";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { AppButton, AppInput } from "@/shared/ui";
import type { User, CreateUserDto } from "@/entities/user";

const props = defineProps<{
  initialData?: User | null;
  isEditing?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", data: CreateUserDto): void;
  (e: "cancel"): void;
}>();

const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "Обов'язкове поле"),
    lastName: z.string().min(1, "Обов'язкове поле"),
    email: z.string().email("Некоректний email"),
    username: z.string().min(1, "Обов'язкове поле"),
    age: z.number().min(1, "Мінімум 1 рік").max(120, "Максимум 120 років"),
    gender: z.string().min(1, "Обов'язкове поле"),
    phone: z.string().min(5, "Некоректний телефон"),
  }),
);

const { handleSubmit, setValues } = useForm({ validationSchema: schema });

const { value: firstName, errorMessage: firstNameErr } =
  useField<string>("firstName");
const { value: lastName, errorMessage: lastNameErr } =
  useField<string>("lastName");
const { value: email, errorMessage: emailErr } = useField<string>("email");
const { value: username, errorMessage: usernameErr } =
  useField<string>("username");
const { value: age, errorMessage: ageErr } = useField<number>("age");
const { value: gender, errorMessage: genderErr } = useField<string>("gender");
const { value: phone, errorMessage: phoneErr } = useField<string>("phone");

onMounted(() => {
  if (props.initialData) {
    setValues({
      firstName: props.initialData.firstName,
      lastName: props.initialData.lastName,
      email: props.initialData.email,
      username: props.initialData.username,
      age: props.initialData.age,
      gender: props.initialData.gender,
      phone: props.initialData.phone,
    });
  }
});

const onSubmit = handleSubmit((values) => {
  emit("submit", values as CreateUserDto);
});
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-2 gap-4"
    @submit.prevent="onSubmit"
  >
    <AppInput
      id="firstName"
      v-model="firstName"
      label="Ім'я"
      :error="firstNameErr"
    />
    <AppInput
      id="lastName"
      v-model="lastName"
      label="Прізвище"
      :error="lastNameErr"
    />
    <AppInput
      id="email"
      v-model="email"
      type="email"
      label="Email"
      :error="emailErr"
    />
    <AppInput
      id="username"
      v-model="username"
      label="Username"
      :error="usernameErr"
    />
    <AppInput
      id="age"
      v-model.number="age"
      type="number"
      label="Вік"
      :error="ageErr"
    />
    <AppInput
      id="gender"
      v-model="gender"
      label="Стать (male/female)"
      :error="genderErr"
    />
    <AppInput
      id="phone"
      v-model="phone"
      label="Телефон"
      class="md:col-span-2"
      :error="phoneErr"
    />

    <div class="md:col-span-2 flex gap-3 mt-4">
      <AppButton
        type="submit"
        :label="isEditing ? 'Оновити' : 'Створити'"
        :loading="loading"
      />
      <AppButton
        type="button"
        label="Скасувати"
        severity="secondary"
        @click="emit('cancel')"
      />
    </div>
  </form>
</template>
