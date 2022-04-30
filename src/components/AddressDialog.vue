<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">{{ props.title }}</div>
        <q-toggle
          v-if="props.mode === 'edit'"
          v-model="state.active"
          @update:model-value="state.modified = true"
          label="Active"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          ref="addressInput"
          label="Address"
          v-model="state.address"
          @update:model-value="state.modified = true"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'Address is required']"
          lazy-rules="ondemand"
          clearable
        />
        <q-input
          ref="zipInput"
          label="ZIP"
          v-model="state.zip"
          @update:model-value="state.modified = true"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'ZIP is required']"
          lazy-rules="ondemand"
          clearable
        />
        <q-input
          ref="cityInput"
          label="City"
          v-model="state.city"
          @update:model-value="state.modified = true"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'City is required']"
          lazy-rules="ondemand"
          clearable
        />
        <q-input
          ref="countryInput"
          label="Country"
          v-model="state.country"
          @update:model-value="state.modified = true"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'Country is required']"
          lazy-rules="ondemand"
          clearable
        />
        <q-select
          v-model="state.type"
          :options="types"
          label="Address Type"
          @update:model-value="state.modified = true"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn icon="close" label="Cancel" @click="onDialogCancel" />
        <q-btn
          v-if="props.mode === 'add'"
          color="primary"
          icon="add"
          label="Add"
          @click="onAdd"
        />
        <q-btn
          v-if="props.mode === 'edit'"
          color="red"
          icon="delete"
          label="Delete"
          @click="onDelete"
        />
        <q-btn
          v-if="props.mode === 'edit' && state.modified"
          color="orange"
          icon="edit"
          label="Edit"
          @click="onModify"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { ref, reactive } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
    required: false,
  },
  mode: {
    type: String,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const state = reactive({
  modified: false,
  id: props.address ? props.address.id : "",
  address: props.address ? props.address.street : "",
  zip: props.address ? props.address.zip : "",
  city: props.address ? props.address.city : "",
  country: props.address ? props.address.country : "",
  type: props.address ? props.address.type : "main",
  active: props.address ? props.address.active : false,
});

const types = ["main", "invoice", "delivery"];

const addressInput = ref(null);
const zipInput = ref(null);
const cityInput = ref(null);
const countryInput = ref(null);

const isValid = () => {
  return (
    addressInput.value.validate() ||
    zipInput.value.validate() ||
    cityInput.value.validate() ||
    countryInput.value.validate()
  );
};

const onAdd = () => {
  if (isValid()) {
    onDialogOK({
      address: state.address,
      zip: state.zip,
      city: state.city,
      country: state.country,
      type: state.type,
    });
  }
};

const onModify = () => {
  if (isValid()) {
    onDialogOK({
      id: state.id,
      active: state.active,
      street: state.address,
      zip: state.zip,
      city: state.city,
      country: state.country,
      type: state.type,
    });
  }
};

const onDelete = () => {
  onDialogOK({
    deleteId: state.id,
  });
};
</script>
