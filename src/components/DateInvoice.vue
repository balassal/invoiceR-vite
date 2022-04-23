<template>
  <div class="row items-center q-py-sm q-my-sm">
    <div v-if="props.label" class="col-3">{{ props.label }}</div>
    <div :class="props.label ? 'col-9' : 'col'">
      <q-input
        clearable
        dense
        class="q-pb-none"
        ref="dateInput"
        :readonly="!props.editable"
        v-model="selectedDate"
        :rules="[(val) => !!val || 'Please provide a date.']"
        lazy-rules="ondemand"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                :readonly="!props.editable"
                minimal
                v-model="selectedDate"
                mask="YYYY-MM-DD"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const dateInput = ref(null);
const selectedDate = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  }
})

const props = defineProps({
  modelValue : {
    type: String,
    required: false
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isValid = () => {
  return dateInput.value.validate();
};

defineExpose({ isValid });
</script>
