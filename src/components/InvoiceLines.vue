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
        <q-btn v-if="editable" color="primary" icon="add" label="Add" @click="onAddBtn" />
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

  <invoice-line-dialog
    :title="dialogTitle"
    :show="showDialog"
    @update:show="(newValue) => showDialog = newValue"
    :line="selectedLine"
    @onAddNewLine="addNewLine($event)"
    :edit="editLine"
    @onModifyLine="modifyLine($event)"
    @onDeleteLine="deleteLine($event)"
  >
  </invoice-line-dialog>

</template>

<script setup>
import { ref, computed, reactive } from "vue";
import InvoiceLineDialog from "./InvoiceLineDialog.vue";
import { v4 as uuid } from "uuid";

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
  }
})

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
    required: true
  },
  lines: {
    type: Array,
    required: true
  },
  editable: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(["addNewLine", "modifyLine", "deleteLine"])

const loading = ref(false);
const filter = ref("");
const showDialog = ref(false);
const editLine = ref(false);
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
  total: 0
});

const onAddBtn = () => {
  dialogTitle.value = "Add new line";
  editLine.value = false;
  selectedLine.id = uuid();
  selectedLine.invoiceId = props.invoiceId;
  selectedLine.productId = "";
  selectedLine.label = "";
  selectedLine.quantity = 0;
  selectedLine.uomId = "";
  selectedLine.unitPrice = 0;
  selectedLine.taxesIds = [];
  selectedLine.taxAmount = 0;
  selectedLine.netAmount = 0;
  selectedLine.total = 0;
  showDialog.value = true;
};

const handleRowSelect = (event, row, index) => {
  if (props.editable) {
    dialogTitle.value = "Modify line"
    selectedLine.id = row.id;
    selectedLine.invoiceId = row.invoiceId;
    selectedLine.productId = row.productId;
    selectedLine.label = row.label;
    selectedLine.quantity = row.quantity;
    selectedLine.uomId = row.uomId;
    selectedLine.unitPrice = row.unitPrice;
    selectedLine.taxesIds = row.taxesIds;
    selectedLine.taxAmount = row.taxAmount;
    selectedLine.netAmount = row.netAmount;
    selectedLine.total = row.total;
    editLine.value = true;
    showDialog.value = true;
  }
}

const addNewLine = (event) => {
  emit("addNewLine", event);
}

const modifyLine = (event) => {
  emit("modifyLine", event);
}

const deleteLine = (event) => {
  emit("deleteLine", event);
}

</script>
