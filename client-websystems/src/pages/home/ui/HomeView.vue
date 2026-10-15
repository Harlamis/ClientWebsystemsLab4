<template>
  <div
    class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col gap-6 text-gray-800 dark:text-gray-200 transition-colors"
  >
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
      Vue Lottery Application
    </h1>
    <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
      Інтерактивний навчальний вебзастосунок для проведення лотереї, побудований
      на сучасних фронтенд-технологіях.
    </p>

    <div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-3">
        Використовувані технології:
      </h2>
      <ul
        class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1"
      >
        <li>Vue 3 (Composition API) & TypeScript</li>
        <li>
          Vue Router 4 (динамічна маршрутизація, lazy loading, navigation
          guards)
        </li>
        <li>
          Pinia (управління глобальним станом авторизації та користувачів)
        </li>
        <li>Repository Pattern (ізоляція роботи з REST API)</li>
        <li>Feature-Sliced Design (FSD) & Steiger Linter</li>
        <li>VeeValidate & Zod (валідація форм)</li>
        <li>PrimeVue & Tailwind CSS & SCSS</li>
      </ul>
    </div>

    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
      >
        Переглянути репозиторій проєкту на GitHub &rarr;
      </a>
    </div>
  </div>
</template>
