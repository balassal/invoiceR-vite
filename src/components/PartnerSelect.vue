<template>
  <div class="row items-center q-py-sm q-my-sm">
    <div class="col-3">Partner</div>
    <div class="col-9">
      <q-select
        clearable
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
  <q-card-section v-if="selectedPartner != null">
    <div class="row items-center">
      <div class="col-3">VAT Number</div>
      <div class="col-9">{{ selectedPartner.vatnumber }}</div>
    </div>
    <div class="row items-center">
      <div class="col-3">Address</div>
      <div class="col-9">
        {{ selectedPartner.addressIds[0].country }},
        {{ selectedPartner.addressIds[0].zip }}
        {{ selectedPartner.addressIds[0].city }},
        {{ selectedPartner.addressIds[0].street }}
      </div>
    </div>
    <div class="row items-center">
      <div class="col-3">Bank</div>
      <div class="col-9">
        <q-select
          clearable
          dense
          ref="bankSelect"
          :readonly="!editable"
          :options="selectedPartner.bankAccountIds"
          v-model="selectedBank"
          :rules="[(val) => !!val || 'Please select a Bank Account']"
          lazy-rules="ondemand"
        />
      </div>
    </div>
  </q-card-section>
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
    type: String,
    required: true
  },
  bank: {
    type: String,
    required: true
  }
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
  }
})
const selectedBank = computed({
  get() {
    return props.bank;
  },
  set(val) {
    emit("update:bank", JSON.stringify(val));
  }
})

onMounted(() => {
  partners.value = getPartners();
});

const isValid = () => {
  return partnerSelect.value.validate() && bankSelect.value.validate();
};

defineExpose({ isValid });
</script>
