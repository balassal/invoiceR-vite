<template>
  <q-page class="q-pa-sm">
    <div class="q-mt-sm shadow-2">
      <q-table
        title="Products"
        class="products-table"
        :rows="products"
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
            <q-btn color="primary" icon="add" label="Add" to="/products/new" />
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
import { useQuasar } from "quasar";
import { getProducts } from "src/store/product";
import { ref, onMounted, computed } from "vue";

const $q = useQuasar();
const screenHeight = computed(() => {
  return $q.screen.height - 80;
});

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  { name: "label", label: "Label", field: "label", sortable: true },
  {
    name: "internalref",
    label: "Reference",
    field: "internalref",
    sortable: true,
  },
  { name: "active", label: "Active?", field: "active", sortable: true },
  { name: "type", label: "Type", field: "type", sortable: true },
  {
    name: "unitprice",
    label: "Price",
    field: "unitprice",
    sortable: true,
    format: (val) => `${val.toLocaleString("hu-HU")}`,
  },
  {
    name: "uomId",
    label: "UOM",
    field: (row) => row.uomId.name,
    sortable: true,
  },
  {
    name: "saletaxes",
    label: "Sale taxes",
    field: (row) => {
      const taxes = row.saletaxes.map((t) => t.name);
      return taxes.join(", ");
    },
    sortable: true,
  },
  {
    name: "purchasetaxes",
    label: "Purchase taxes",
    field: (row) => {
      const taxes = row.purchasetaxes.map((t) => t.name);
      return taxes.join(", ");
    },
    sortable: true,
  },
  { name: "note", label: "Note", field: "note", sortable: true },
];
const visibleColumns = ref(["name", "label", "internalref", "active"]);

const products = ref([]);
const loading = ref(false);
const selected = ref([]);
const filter = ref("");

onMounted(async () => {
  await loadProducts();
});

const loadProducts = async () => {
  loading.value = true;
  products.value = await getProducts();
  loading.value = false;
};

const onRowClicked = (e, row) => {
  console.log("row :>> ", row);
};

const handleFilter = (e) => {
  console.log("e :>> ", e);
};
</script>

<style lang="sass">
.products-table
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
