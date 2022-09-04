<template>
  <q-table
    title="Invoice Lines"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :visible-columns="visibleColumns"
    :filter="filter"
    :loading="loading"
    :rows-per-page-options="[10, 20, 25, 50, 100]"
    :dense="$q.screen.lt.md"
    :hide-no-data="true"
    @row-click="handleRowSelect"
  >
    <template v-slot:top>
      <div class="q-gutter-xs">
        <q-btn
          v-if="editable"
          color="primary"
          icon="add"
          label="Add"
          @click="onAddBtn"
        />
      </div>
      <q-space />
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
  </q-table>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { v4 as uuid } from "uuid";
import { useQuasar } from "quasar";
import InvoiceLineDialog from "./InvoiceLineDialog.vue";

const $q = useQuasar();

const columns = [
  {
    name: "product",
    required: true,
    label: "Product",
    align: "left",
    field: (row) => row.productId,
    format: (val) => `${val.label}`,
    sortable: true,
  },
  {
    name: "label",
    label: "Description",
    field: "label",
    sortable: true,
  },
  {
    name: "quantity",
    label: "Quantity",
    field: "quantity",
    sortable: true,
  },
  {
    name: "uomId",
    label: "Unit of Measure",
    field: "uomId",
    sortable: true,
  },
  {
    name: "unitPrice",
    label: "Unit Price",
    field: "unitPrice",
    sortable: true,
    format: (val) => `${val.toLocaleString("hu-HU")}`,
  },
  {
    name: "netAmount",
    label: "Net Amount",
    field: "netAmount",
    sortable: true,
    format: (val) => `${val.toLocaleString("hu-HU")}`,
  },
  {
    name: "taxes",
    label: "Taxes",
    field: (row) => row.taxesIds,
    format: (val) => `${val.map((v) => v.label)}`,
    sortable: true,
  },
  {
    name: "taxAmount",
    label: "Tax Amount",
    field: "taxAmount",
    sortable: true,
    format: (val) => `${val.toLocaleString("hu-HU")}`,
  },
  {
    name: "total",
    label: "Total",
    field: "total",
    sortable: true,
    format: (val) => `${val.toLocaleString("hu-HU")}`,
  },
];

// const rows = reactive(props.lines);
const rows = computed({
  get() {
    return props.lines;
  },
});

const visibleColumns = ref([
  "product",
  "label",
  "quantity",
  "uom",
  "unitPrice",
  "netAmount",
  "taxes",
  "taxAmount",
  "total",
]);

const props = defineProps({
  invoiceId: {
    type: String,
    required: true,
  },
  lines: {
    type: Array,
    required: true,
  },
  editable: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["addNewLine", "modifyLine", "deleteLine"]);

const loading = ref(false);
const filter = ref("");
// const editLine = ref(false);
const dialogTitle = ref("");
const selectedLine = reactive({
  id: uuid(),
  invoiceId: props.invoiceId,
  productId: "",
  label: "",
  quantity: 0,
  uomId: "",
  unitPrice: 0,
  taxesIds: [],
  taxAmount: 0,
  netAmount: 0,
  total: 0,
});

const onAddBtn = () => {
  $q.dialog({
    component: InvoiceLineDialog,
    componentProps: {
      title: "Add line",
      mode: "add",
    },
  }).onOk(async ({ line }) => {
    emit("addNewLine", { line });
  });
};

const handleRowSelect = (event, row, index) => {
  $q.dialog({
    component: InvoiceLineDialog,
    componentProps: {
      title: "Modify line",
      mode: "edit",
      line: JSON.parse(JSON.stringify(row)),
    },
  }).onOk((result) => {
    if (result.type === "update") {
      emit("modifyLine", { line: result.line });
    } else if (result.type === "delete") {
      emit("deleteLine", { id: result.id });
    }
  });
};
</script>
