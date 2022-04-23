<template>
  <q-page class="q-pa-sm">
    <div class="q-mt-sm shadow-2">
      <q-table
        title="Treats"
        class="invoices-table"
        :rows="rows"
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
            <q-btn color="secondary" icon="file_download" label="Import" />
            <q-btn
              icon="file_upload"
              label="Export to csv"
              @click="exportTable"
            />
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
        <!-- <template v-slot:body-cell-name="props">
          <q-td :props="props"> 
            <a href="#/invoices/{{props.row.id}}">{{ props.row.name }}</a>
          </q-td>
        </template> -->
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

<script>
import { useQuasar, exportFile } from "quasar";
import { defineComponent } from "vue";
import { ref, computed } from "vue";
import { getInvoices } from "../../store/invoice";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "name",
    required: true,
    label: "Number",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "partner", label: "Partner", field: "partner", sortable: true },
  { name: "date", label: "Date", field: "date", sortable: true },
  { name: "delivery", label: "Delivery", field: "delivery", sortable: true },
  { name: "due", label: "Due", field: "due", sortable: true },
  { name: "payment", label: "Payment", field: "payment", sortable: true },
  { name: "currency", label: "Currency", field: "currency", sortable: true },
  {
    name: "netamount",
    label: "Net Amount",
    field: "netamount",
    sortable: true,
  },
  { name: "vat", label: "VAT", field: "vat", sortable: true },
  { name: "total", label: "Total", field: "total", sortable: true },
];

const rows = getInvoices().map((inv) => {
  return {
    id: inv.id,
    name: inv.number,
    partner: inv.partnerId.name,
    date: inv.invoiceDate,
    delivery: inv.deliveryDate,
    due: inv.dueDate,
    payment: inv.paymentMode,
    currency: inv.currencyId.label,
    netamount: inv.netAmount.toLocaleString(),
    vat: inv.vatAmount.toLocaleString(),
    total: inv.totalAmount.toLocaleString(),
  };
});

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default defineComponent({
  name: "PageInvoices",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const loading = ref(false);
    const filter = ref("");
    const screenHeight = computed(() => {
      return $q.screen.height - 80;
    });
    const selected = ref([]);
    const invoices = ref(getInvoices());
    return {
      loading,
      filter,
      visibleColumns: ref([
        "name",
        "partner",
        "delivery",
        "date",
        "due",
        "netamount",
        "vat",
        "total",
        "payment",
        "currency",
      ]),
      columns,
      rows,
      screenHeight,
      selected,
      invoices,

      exportTable() {
        // naive encoding to csv format
        const content = [columns.map((col) => wrapCsvValue(col.label))]
          .concat(
            rows.map((row) =>
              columns
                .map((col) =>
                  wrapCsvValue(
                    typeof col.field === "function"
                      ? col.field(row)
                      : row[col.field === void 0 ? col.name : col.field],
                    col.format
                  )
                )
                .join(",")
            )
          )
          .join("\r\n");

        const status = exportFile("table-export.csv", content, "text/csv");

        if (status !== true) {
          $q.notify({
            message: "Browser denied file download...",
            color: "negative",
            icon: "warning",
          });
        }
      },

      onRowClicked(evt, row) {
        router.push({ name: "invoice", params: { id: row.id, editable: false} })
      },
    };
  },
});
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
