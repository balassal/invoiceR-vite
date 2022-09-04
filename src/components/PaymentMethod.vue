<template>
  <div class="row items-center">
    <div class="col-3">Payment Method</div>
    <div class="col-9">
      <q-select
        clearable
        dense
        ref="paymentMethodField"
        :readonly="!props.editable"
        :options="paymentModes"
        v-model="selectedPaymentMode"
        :rules="[(val) => !!val || 'Please select a Payment']"
        lazy-rules="ondemand"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const paymentModes = ["transfer", "credit", "card", "cash", "voucher"];
const selectedPaymentMode = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:model-value", val);
  },
});
const paymentMethodField = ref(null);
const props = defineProps({
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["update:model-value"]);

const isValid = () => {
  return paymentMethodField.value.validate();
};

defineExpose({ isValid });
</script>
