<template>
  <div class="row items-center q-pa-sm">
    <div class="col-3">Partner</div>
    <div class="col-9">
      <q-select
        dense
        class="q-pb-none"
        ref="partnerSelect"
        :readonly="!props.editable"
        :options="partners"
        v-model="selectedPartner"
        :rules="[(val) => !!val || 'Please select a Partner']"
        lazy-rules="ondemand"
      />
    </div>
  </div>
  <template v-if="selectedPartner && selectedPartner.label !== ''">
    <div class="row items-center q-pa-sm">
      <div class="col-3">VAT Number</div>
      <div class="col-9">{{ selectedPartner.vatnumber }}</div>
    </div>
    <template v-if="selectedPartner.addressIds">
      <div class="row items-center q-pa-sm">
        <div class="col-3">Address</div>
        <div class="col-9">
          {{ selectedPartner.addressIds[0].country }},
          {{ selectedPartner.addressIds[0].zip }}
          {{ selectedPartner.addressIds[0].city }},
          {{ selectedPartner.addressIds[0].street }}
        </div>
      </div>
      <div class="row items-center q-pa-sm">
        <div class="col-3">Bank</div>
        <div class="col-9">
          {{ selectedPartner.bankAccountIds[0].label }} -
          {{ selectedPartner.bankAccountIds[0].accountNumber }}
        </div>
      </div>
    </template>
  </template>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getPartners } from "../store/partner";

const props = defineProps({
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
  partner: {
    type: [Object, null],
    required: true,
  },
});

const emit = defineEmits(["update:partner", "update:bank"]);

const partners = ref(null);
const partnerSelect = ref(null);
const bankSelect = ref(null);
const selectedPartner = computed({
  get() {
    return props.partner;
  },
  set(val) {
    emit("update:partner", JSON.stringify(val));
  },
});

onMounted(async () => {
  partners.value = await getPartners();
});

const isValid = () => {
  return partnerSelect.value.validate();
};

defineExpose({ isValid });
</script>
