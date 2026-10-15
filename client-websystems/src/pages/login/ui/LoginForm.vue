<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "primevue/usetoast";
import { AppButton, AppInput } from "@/shared/ui";
import { useSessionStore } from "@/entities/session";

const router = useRouter();
const route = useRoute();
const sessionStore = useSessionStore();
const toast = useToast();

const schema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Обов'язкове поле"),
    password: z.string().min(6, "Пароль повинен містити щонайменше 6 символів"),
  }),
);

const { handleSubmit } = useForm({ validationSchema: schema });
const { value: username, errorMessage: usernameErr } =
  useField<string>("username");
const { value: password, errorMessage: passwordErr } =
  useField<string>("password");

const isLoading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await sessionStore.login(values);
    toast.add({
      severity: "success",
      summary: "Успіх",
      detail: "Ви успішно авторизувалися",
      life: 3000,
    });
    const redirect = (route.query.redirect as string) || "/users";
    router.push(redirect);
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Помилка",
      detail: (err as Error).message || "Помилка входу",
      life: 4000,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <form class="flex flex-col gap-4 w-full" @submit.prevent="onSubmit">
    <AppInput
      id="username"
      v-model="username"
      label="Username"
      :error="usernameErr"
    />
    <AppInput
      id="password"
      v-model="password"
      type="password"
      label="Password"
      :error="passwordErr"
    />
    <AppButton
      type="submit"
      label="Увійти"
      :loading="isLoading"
      class="mt-2 w-full"
    />
  </form>
</template>