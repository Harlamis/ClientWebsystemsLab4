import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/home").then((m) => m.HomePage),
    meta: { title: "Головна - Vue Lottery" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/about").then((m) => m.AboutPage),
    meta: { title: "Про автора - Vue Lottery" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login").then((m) => m.LoginPage),
    meta: { title: "Авторизація", layout: "auth" },
  },
  {
    path: "/users",
    name: "users",
    component: () => import("@/pages/users").then((m) => m.UsersPage),
    meta: { title: "Список учасників", requiresAuth: true },
  },
  {
    path: "/users/:id",
    name: "user-details",
    component: () =>
      import("@/pages/user-details").then((m) => m.UserDetailsPage),
    props: true,
    meta: { title: "Деталі користувача", requiresAuth: true },
  },
  {
    path: "/users/:id/edit",
    name: "user-edit",
    component: () => import("@/pages/user-edit").then((m) => m.UserEditPage),
    props: true,
    meta: { title: "Редагування користувача", requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/not-found").then((m) => m.NotFoundPage),
    meta: { title: "404 - Сторінку не знайдено" },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || "Vue Lottery App";
});
