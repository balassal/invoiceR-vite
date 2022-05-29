<template>
  <q-page padding>
    <div v-if="showForm" class="row items-center q-pa-sm shadow-2 q-mb-sm">
      <span class="q-mx-sm">Add new language...</span>
      <q-input
        ref="formLabel"
        class="q-mx-md"
        dense
        clearable
        :readonly="loading"
        autocomplete="hide"
        v-model="newItem.label"
        label="Label"
        @keyup.enter="onSubmit"
        @keyup.esc="onCancelForm"
        :rules="[(val) => val.trim() != '' || 'Label is required!']"
        lazy-rules="ondemand"
      />
      <q-input
        ref="formName"
        class="q-mx-md"
        dense
        clearable
        :readonly="loading"
        autocomplete="hide"
        v-model="newItem.name"
        label="Name"
        @keyup.enter="onSubmit"
        @keyup.esc="onCancelForm"
        :rules="[(val) => val.trim() != '' || 'Name is required!']"
        lazy-rules="ondemand"
      />
      <q-input
        ref="formCode"
        class="q-mx-md"
        dense
        clearable
        :readonly="loading"
        autocomplete="hide"
        v-model="newItem.shortCode"
        label="Short code"
        @keyup.enter="onSubmit"
        @keyup.esc="onCancelForm"
        :rules="[(val) => val.trim() != '' || 'Short code is required!']"
        lazy-rules="ondemand"
      />
      <q-btn
        size="sm"
        class="q-mr-md"
        color="primary"
        :disable="loading"
        label="Submit"
        icon="done"
        @click="onSubmit"
      />
      <q-btn
        size="sm"
        class="q-mr-md"
        :disable="loading"
        label="Cancel"
        icon="close"
        @click="onCancelForm"
      />
    </div>
    <q-table
      title="Languages"
      :rows="languages"
      :columns="columns"
      row-key="name"
      :loading="loading"
      :filter="filter"
      color="primary"
      :pagination="initialPagination"
    >
      <template v-slot:top>
        <div class="q-table__title">Languages</div>
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
          <q-td key="label" :props="props">
            {{ props.row.label }}
            <q-popup-edit v-model="props.row.label" v-slot="scope">
              <q-input
                v-model="scope.value"
                @keyup.enter="handleChange(props.row, scope, 'label')"
                dense
                autofocus
                counter
              />
            </q-popup-edit>
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
          <q-td key="code" :props="props">
            {{ props.row.shortCode }}
            <q-popup-edit v-model="props.row.shortCode" v-slot="scope">
              <q-input
                v-model="scope.value"
                @keyup.enter="handleChange(props.row, scope, 'shortCode')"
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
              @click="removeLanguage(props.row.id)"
              icon="delete"
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getLanguages,
  saveLanguages,
  deleteLanguage,
  updateLanguage,
} from "src/store/language";
import { v4 as uuid } from "uuid";

const columns = [
  {
    name: "label",
    align: "left",
    label: "Label",
    field: "label",
    sortable: true,
  },
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "code", label: "Code", field: "shortCode" },
  { name: "actions", label: "Actions", field: "", align: "center" },
];

const initialPagination = {
  sortBy: "label",
  descending: false,
  page: 1,
  rowsPerPage: 10,
};

const loading = ref(false);
const languages = ref([]);
const showForm = ref(false);
const filter = ref("");

const formLabel = ref(null);
const formName = ref(null);
const formCode = ref(null);

const newItem = reactive({
  label: "",
  name: "",
  shortCode: "",
});

onMounted(async () => {
  await loadLanguages();
});

const loadLanguages = async () => {
  loading.value = true;
  languages.value = await getLanguages();
  loading.value = false;
};

const addRow = () => {
  newItem.label = "";
  newItem.name = "";
  newItem.shortCode = "";
  showForm.value = true;
};

const onSubmit = async () => {
  if (isValid()) {
    loading.value = true;
    const newLang = {
      id: uuid(),
      ...newItem,
    };

    const response = await saveLanguages(newLang);
    if (response.status === 201) {
      await loadLanguages();
    } else {
      console.log("Failed to add new language: ", response);
    }

    onCancelForm();
    loading.value = false;
  }
};

const onCancelForm = () => {
  newItem.label = "";
  newItem.name = "";
  newItem.shortCode = "";
  showForm.value = false;
};

const isValid = () => {
  const isFormValid =
    formLabel.value.validate() ||
    formName.value.validate() ||
    formCode.value.validate();

  const anyLang = languages.value.some((lang) => lang.name === newItem.name);

  return isFormValid && !anyLang;
};

const removeLanguage = async (id) => {
  const response = await deleteLanguage(id);
  if (response.status === 200) {
    loadLanguages();
  } else {
    console.log("Failed to delete language: ", response);
  }
};

const handleChange = async (row, scope, field) => {
  const lang = JSON.parse(JSON.stringify(row));
  const found = languages.value.find((l) => l.id === lang.id);
  if (scope.value.toString().trim() !== found[field]) {
    found[field] = scope.value.toString().trim();

    const result = await updateLanguage(found);
    if (result.status === 200) {
      scope.cancel();
      loadLanguages();
    } else {
      console.log(response);
    }
  }
};
</script>
