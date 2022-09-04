<template>
  <q-page class="q-pa-sm">
    <div class="q-mt-sm shadow-2">
      <q-table
        title="Invoices"
        class="invoices-table"
        :rows="invoices"
        :columns="columns"
        row-key="id"
        :visible-columns="visibleColumns"
        :filter="filter"
        :loading="loading"
        :rows-per-page-options="[10, 20, 25, 50, 100]"
        :style="{ height: screenHeight + 'px' }"
        selection="multiple"
        v-model:selected="selected"
        :dense="$q.screen.lt.md"
        @row-click="onRowClicked"
      >
        <template v-slot:top>
          <div class="q-gutter-xs">
            <q-btn color="primary" icon="add" label="Add" to="/invoice/new" />
          </div>
          <q-space />
          <q-input
            class="q-mr-sm"
            dense
            debounce="300"
            color="primary"
            v-model="filter"
            label="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            options-cover
            style="min-width: 150px"
          />
        </template>
        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> Well this is sad... {{ message }} </span>
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useQuasar } from "quasar";
import { getInvoices } from "src/store/invoice";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const screenHeight = computed(() => $q.screen.height - 80);
const router = useRouter();
const loading = ref(false);
const invoices = ref([]);
const filter = ref("");
const selected = ref([]);

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "status",
    required: true,
    label: "Status",
    align: "center",
    field: "status",
    sortable: true,
  },
  {
    name: "partnerId",
    label: "Partner",
    align: "center",
    field: (row) => row.partnerId.name,
    sortable: true,
  },
  {
    name: "invoiceDate",
    required: true,
    label: "Date",
    align: "center",
    field: "invoiceDate",
    sortable: true,
  },
  {
    name: "deliveryDate",
    label: "Delivery Date",
    align: "center",
    field: "deliveryDate",
    sortable: true,
  },
  {
    name: "dueDate",
    label: "Due Date",
    align: "center",
    field: "dueDate",
    sortable: true,
  },
  {
    name: "paymentTherm",
    label: "Payment Therm",
    align: "center",
    field: "paymentTherm",
    sortable: true,
  },
  {
    name: "paymentMode",
    label: "Payment Mode",
    align: "center",
    field: "paymentMode",
    sortable: true,
  },
  {
    name: "currencyId",
    label: "Currency",
    align: "center",
    field: (row) => row.currencyId.label,
    sortable: true,
  },
  {
    name: "netAmount",
    label: "Net Amount",
    align: "center",
    field: "netAmount",
    format: (val) => `${val.toLocaleString()}`,
    sortable: true,
  },
  {
    name: "vatAmount",
    label: "Tax",
    align: "center",
    field: "vatAmount",
    format: (val) => `${val.toLocaleString()}`,
    sortable: true,
  },
  {
    name: "totalAmount",
    required: true,
    label: "Total",
    align: "center",
    field: "totalAmount",
    format: (val) => `${val.toLocaleString()}`,
    sortable: true,
  },
  {
    name: "toBePaid",
    label: "Paid",
    align: "center",
    field: "toBePaid",
    format: (val) => `${val.toLocaleString()}`,
    sortable: true,
  },
];
const visibleColumns = ref([
  "name",
  "status",
  "partnerId",
  "invoiceDate",
  "totalAmount",
]);

onMounted(async () => {
  await loadInvoices();
});

const loadInvoices = async () => {
  loading.value = true;
  invoices.value = await getInvoices();
  loading.value = false;
};

const onRowClicked = (e, row) => {
  router.push({ name: "invoice", params: { id: row.id } });
};
</script>

<style lang="sass">
.invoices-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
