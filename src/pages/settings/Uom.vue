<template>
  <q-page padding>
    <q-table
      title="Unit of Measures"
      :rows="uoms"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      color="primary"
      :pagination="initialPagination"
    >
      <template v-slot:top>
        <div class="q-table__title">Unit of Measures</div>
        <q-space />
        <q-btn
          size="sm"
          class="q-mr-md"
          outline
          color="primary"
          :disable="loading"
          label="Add"
          icon="add"
          @click="addRow"
        />
        <q-input
          dense
          debounce="300"
          color="primary"
          v-model="filter"
          placeholder="Search..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input
                v-model="scope.value"
                @keyup.enter="handleChange(props.row, scope, 'name')"
                dense
                autofocus
                counter
              />
            </q-popup-edit>
          </q-td>
          <q-td key="symbol" :props="props">
            {{ props.row.symbol }}
            <q-popup-edit v-model="props.row.symbol" v-slot="scope">
              <q-input
                v-model="scope.value"
                @keyup.enter="handleChange(props.row, scope, 'symbol')"
                dense
                autofocus
                counter
              />
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="remove(props.row.id)"
              icon="delete"
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { createUom, deleteUom, getUoms, updateUom } from "src/store/uom";
import { ref, onMounted } from "vue";
import { v4 as uuid } from "uuid";

const loading = ref(false);
const filter = ref("");
const uoms = ref([]);

const initialPagination = {
  sortBy: "name",
  descending: false,
  page: 1,
  rowsPerPage: 10,
};

const columns = [
  {
    name: "id",
    required: true,
    align: "center",
    label: "ID",
    field: (row) => row.id,
    format: (val) => `${val}`,
  },
  {
    name: "name",
    label: "Name",
    align: "center",
    field: "name",
    sortable: true,
  },
  {
    name: "symbol",
    label: "Symbol",
    align: "center",
    field: "symbol",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "", align: "center" },
];

onMounted(async () => {
  await loadUoms();
});

const loadUoms = async () => {
  loading.value = true;
  uoms.value = await getUoms();
  loading.value = false;
};

const addRow = async () => {
  const newUom = {
    id: uuid(),
    name: "",
  };
  const response = await createUom(newUom);
  if (response.status == 201) {
    await loadUoms();
  } else {
    alert("Failed to add new UoM! Check console for more details!");
    console.log("Failed to add new uom: ", response);
  }
};

const handleChange = async (row, scope, field) => {
  const uom = JSON.parse(JSON.stringify(row));
  const found = uoms.value.find((u) => u.id === uom.id);
  if (scope.value.toString().trim() !== found[field]) {
    found[field] = scope.value.toString().trim();

    const result = await updateUom(found);
    if (result.status === 200) {
      scope.cancel();
      await loadUoms();
    } else {
      alert("Failed to update row! Check console for more details!");
      console.log("Failed to update row: ", response);
    }
  }
};

const remove = async (id) => {
  const response = await deleteUom(id);
  if (response.status == 200) {
    await loadUoms();
  } else {
    alert("Failed to delete Uom! Check console for more details!");
    console.log("Failed to delete uom: ", response);
  }
};
</script>
