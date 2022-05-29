<template>
  <spinner v-if="loading"></spinner>
  <q-page v-else padding>
    <div class="row q-pa-md q-gutter-sm items-center">
      <q-card
        v-for="curr in currencies"
        :key="curr.id"
        class="q-pa-sm cursor-pointer"
        style="min-width: 200px"
        @click="openCurrency(curr)"
      >
        <q-card-section>
          <div class="text-center text-subtitle1">
            {{ curr.symbol }}
          </div>
          <div class="text-no-wrap">
            <span class="text-weight-light q-mr-sm">Name:</span>
            <span class="text-subtitle1">
              {{ curr.name }}
            </span>
          </div>
          <div class="text-no-wrap">
            <span class="text-weight-light q-mr-sm">Label:</span>
            <span class="text-subtitle2">
              {{ curr.label }}
            </span>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="showRates" class="q-pa-md">
      <q-table
        title="Rates"
        :rows="rates"
        :columns="rateColumns"
        row-key="date"
        dense
      />
    </div>
  </q-page>
</template>

<script setup>
import { getCurrencies } from "src/store/currency";
import { onMounted, ref } from "vue";

const loading = ref(false);
const currencies = ref([]);
const showRates = ref(false);
const rates = ref([]);

const rateColumns = [
  {
    name: "date",
    align: "center",
    label: "Date",
    field: "date",
    sortable: true,
  },
  {
    name: "exchange",
    label: "Rate",
    field: "exchange",
    sortable: true,
    align: "center",
  },
];

onMounted(async () => {
  await loadCurrencies();
});

const loadCurrencies = async () => {
  loading.value = true;
  currencies.value = await getCurrencies();
  loading.value = false;
};

const openCurrency = (curr) => {
  rates.value = curr.rates;
  showRates.value = true;
};
</script>
