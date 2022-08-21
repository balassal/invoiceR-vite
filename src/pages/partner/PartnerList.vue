<template>
  <q-page class="q-pa-sm">
    <div class="q-mt-sm shadow-2">
      <q-table
        title="Partners"
        class="partner-table"
        :rows="partners"
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
            <q-btn color="primary" icon="add" label="Add" to="/partner/new" />
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
import { getPartners } from "src/store/partner";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const screenHeight = computed(() => {
  return $q.screen.height - 80;
});
const router = useRouter();
const loading = ref(false);
const partners = ref([]);
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
    name: "label",
    label: "Label",
    align: "center",
    field: "label",
    sortable: true,
  },
  {
    name: "active",
    label: "Active?",
    align: "center",
    field: "active",
    format: (val) => `${val === true ? "Active" : "Inactive"}`,
  },
  {
    name: "type",
    label: "Type",
    align: "center",
    field: "type",
    sortable: true,
  },
  {
    name: "vatnumber",
    label: "VAT",
    align: "center",
    field: "vatnumber",
    sortable: true,
  },
];
const visibleColumns = ref(["name", "type", "vatnumber", "active"]);

onMounted(async () => {
  await loadPartners();
});

const loadPartners = async () => {
  loading.value = true;
  partners.value = await getPartners();
  loading.value = false;
};

const onRowClicked = (e, row) => {
  router.push({ name: "partner", params: { id: row.id } });
};
</script>

<style lang="sass">
.partner-table
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
