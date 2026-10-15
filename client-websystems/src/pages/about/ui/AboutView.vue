<template>
  <div
    class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col gap-6 transition-colors"
  >
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
      Про автора
    </h1>

    <div class="flex flex-col gap-2">
      <p class="text-lg font-bold text-gray-800 dark:text-gray-100">
        Студент 3 курсу
      </p>
      <p class="text-gray-600 dark:text-gray-300">
        Спеціальність: Інженерія програмного забезпечення
      </p>
    </div>

    <div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        Technical Skills
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          class="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium rounded-full text-sm"
          >React / TypeScript</span
        >
        <span
          class="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium rounded-full text-sm"
          >C# / .NET</span
        >
        <span
          class="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium rounded-full text-sm"
          >Java / Spring</span
        >
        <span
          class="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium rounded-full text-sm"
          >C++ / Qt</span
        >
      </div>

      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <a
          href="https://github.com/Harlamis"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          GitHub Профіль &rarr;
        </a>
      </div>
    </div>
  </div>
</template>
