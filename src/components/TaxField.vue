<template>
  <div class="q-pa-xs">
    <span class="q-mr-sm text-subtitle2">{{ props.name }}:</span>
    {{ props.taxValue }}
    <q-popup-edit
      :title="props.type !== 'select' ? props.name : ''"
      v-model="fieldValue"
      v-slot="scope"
      auto-save
    >
      <q-input
        v-if="props.type === 'text'"
        v-model="scope.value"
        @keyup.enter="scope.set"
        dense
        autofocus
      />
      <q-input
        v-if="props.type === 'number'"
        v-model.number="scope.value"
        @keyup.enter="scope.set"
        dense
        autofocus
      />
      <q-select
        v-if="props.type === 'select'"
        v-model="scope.value"
        :options="props.options"
        :label="props.name"
      />
    </q-popup-edit>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  taxValue: [String, Number],
  type: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: false,
  },
});

const fieldValue = computed({
  get() {
    return props.taxValue;
  },
  set(val) {
    emit("update:taxValue", val);
  },
});

const emit = defineEmits(["update:taxValue"]);
</script>
