<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useUsersStore } from "../stores/users";

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore();

const isLoading = ref(true);

const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "Обов'язкове поле"),
    lastName: z.string().min(1, "Обов'язкове поле"),
    email: z.string().email("Некоректний email"),
    username: z.string().min(1, "Обов'язкове поле"),
    age: z.number().min(1).max(120),
    gender: z.string().min(1),
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

onMounted(async () => {
  try {
    const data = await usersStore.getUserById(Number(props.id));
    setValues({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
    });
  } finally {
    isLoading.value = false;
  }
});

const onSubmit = handleSubmit(async (values) => {
  await usersStore.updateUser(Number(props.id), values);
  router.push("/users");
});
</script>

<template>
  <div
    class="bg-white p-8 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto"
  >
    <h1 class="text-2xl font-bold mb-6">Редагування користувача</h1>

    <div v-if="isLoading" class="text-center py-4 text-gray-500">
      Завантаження...
    </div>

    <form
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      @submit.prevent="onSubmit"
    >
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Ім'я</label>
        <input
          v-model="firstName"
          type="text"
          class="px-3 py-2 border rounded-md"
        />
        <span class="text-xs text-red-600">{{ firstNameErr }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Прізвище</label>
        <input
          v-model="lastName"
          type="text"
          class="px-3 py-2 border rounded-md"
        />
        <span class="text-xs text-red-600">{{ lastNameErr }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Email</label>
        <input
          v-model="email"
          type="email"
          class="px-3 py-2 border rounded-md"
        />
        <span class="text-xs text-red-600">{{ emailErr }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Username</label>
        <input
          v-model="username"
          type="text"
          class="px-3 py-2 border rounded-md"
        />
        <span class="text-xs text-red-600">{{ usernameErr }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Вік</label>
        <input
          v-model.number="age"
          type="number"
          class="px-3 py-2 border rounded-md"
        />
        <span class="text-xs text-red-600">{{ ageErr }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Стать</label>
        <select v-model="gender" class="px-3 py-2 border rounded-md">
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        <span class="text-xs text-red-600">{{ genderErr }}</span>
      </div>

      <div class="flex flex-col gap-1 md:col-span-2">
        <label class="text-sm font-semibold">Телефон</label>
        <input
          v-model="phone"
          type="text"
          class="px-3 py-2 border rounded-md"
        />
        <span class="text-xs text-red-600">{{ phoneErr }}</span>
      </div>

      <div class="md:col-span-2 flex gap-3 mt-4">
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Зберегти
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          @click="router.push('/users')"
        >
          Скасувати
        </button>
      </div>
    </form>
  </div>
</template>
