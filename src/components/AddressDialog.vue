<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">{{ props.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          ref="addressInput"
          label="Address"
          v-model="address"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'Address is required']"
          lazy-rules="ondemand"
          clearable />
       <q-input
          ref="zipInput"
          label="ZIP"
          v-model="zip"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'ZIP is required']"
          lazy-rules="ondemand"
          clearable />
        <q-input
          ref="cityInput"
          label="City"
          v-model="city"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'City is required']"
          lazy-rules="ondemand"
          clearable />
        <q-input
          ref="countryInput"
          label="Country"
          v-model="country"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'Country is required']"
          lazy-rules="ondemand"
          clearable />
        <q-select
          v-model="type"
          :options="types"
          label="Address Type" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="warning" flat icon="close" label="Cancel" @click="onDialogCancel" />
        <q-btn color="primary" flat icon="add" label="Add" @click="onAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    require: true
  }
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const address = ref("");
const zip = ref("");
const city = ref("");
const country = ref("");
const type = ref("main");
const types = ["main", "invoice", "delivery"]
const addressInput = ref(null);
const zipInput = ref(null)
const cityInput = ref(null)
const countryInput = ref(null)

const isValid = () => {
  return addressInput.value.validate() ||
    zipInput.value.validate() ||
    cityInput.value.validate() ||
    countryInput.value.validate()
}

const onAdd = () => {
  if (isValid()) {
    onDialogOK({
      address: address.value,
      zip: zip.value,
      city: city.value,
      country: country.value,
      type: type.value
    });
  }
}
</script>