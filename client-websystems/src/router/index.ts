import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("../pages/home/HomeView.vue"),
    meta: { title: "Головна - Vue Lottery" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/about/AboutView.vue"),
    meta: { title: "Про автора - Vue Lottery" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: { title: "Авторизація", layout: "auth" },
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../views/UsersView.vue"),
    meta: { title: "Список учасників", requiresAuth: true },
  },
  {
    path: "/users/:id",
    name: "user-details",
    component: () => import("../views/UserDetailsView.vue"),
    props: true,
    meta: { title: "Деталі користувача", requiresAuth: true },
  },
  {
    path: "/users/:id/edit",
    name: "user-edit",
    component: () => import("../views/UserEditView.vue"),
    props: true,
    meta: { title: "Редагування користувача", requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../pages/not-found/NotFoundView.vue"),
    meta: { title: "404 - Сторінку не знайдено" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.name === "login" && authStore.isAuthenticated) {
    return { name: "users" };
  }
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || "Vue Lottery App";
});

export default router;
