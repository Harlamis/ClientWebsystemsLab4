<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const apiError = ref<string | null>(null);

const schema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Обов'язкове поле"),
    password: z.string().min(6, "Пароль повинен містити щонайменше 6 символів"),
  }),
);

const { handleSubmit } = useForm({ validationSchema: schema });

const { value: username, errorMessage: usernameError } =
  useField<string>("username");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await authStore.login(values);
    const redirect = (route.query.redirect as string) || "/users";
    router.push(redirect);
  } catch (err) {
    apiError.value =
      (err as Error).message || "Невірна назва користувача або пароль";
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">Авторизація</h1>
      <p class="text-xs text-gray-500 mt-1">
        Тестові дані: emilys / emilyspass
      </p>
    </div>

    <div
      v-if="apiError"
      class="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md"
    >
      {{ apiError }}
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-700">Username</label>
        <input
          v-model="username"
          type="text"
          class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <span v-if="usernameError" class="text-xs text-red-600">{{
          usernameError
        }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-700">Password</label>
        <input
          v-model="password"
          type="password"
          class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <span v-if="passwordError" class="text-xs text-red-600">{{
          passwordError
        }}</span>
      </div>

      <button
        type="submit"
        class="mt-2 w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
      >
        Увійти
      </button>
    </form>
  </div>
</template>
