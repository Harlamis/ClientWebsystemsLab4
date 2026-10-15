<script setup lang="ts" generic="T extends Record<string, unknown>">
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export interface ColumnDef {
  field: string;
  header: string;
  sortable?: boolean;
}

defineProps<{
  value: T[];
  columns: ColumnDef[];
  loading?: boolean;
}>();
</script>

<template>
  <DataTable
    :value="value"
    :loading="loading"
    responsive-layout="scroll"
    class="p-datatable-sm"
  >
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :sortable="col.sortable"
    >
      <template #body="slotProps">
        <slot :name="col.field" :data="slotProps.data">
          {{ slotProps.data[col.field] }}
        </slot>
      </template>
    </Column>

    <Column v-if="$slots.actions" header="Дії" class="text-center">
      <template #body="slotProps">
        <slot name="actions" :data="slotProps.data" />
      </template>
    </Column>
  </DataTable>
</template>
