<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">{{ props.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          ref="labelInput"
          label="Account Name"
          v-model="state.label"
          @update:model-value="state.modified = true"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'Name is required']"
          lazy-rules="ondemand"
          clearable
        />
        <q-input
          ref="bankInput"
          label="Bank Name"
          v-model="state.bank"
          @update:model-value="state.modified = true"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'Bank is required']"
          lazy-rules="ondemand"
          clearable
        />
        <q-input
          ref="numberInput"
          label="Account Number"
          v-model="state.accountNumber"
          @update:model-value="state.modified = true"
          autocomplete="hidden"
          :rules="[(val) => !!val || 'Number is required']"
          lazy-rules="ondemand"
          clearable
        />
        <q-select
          v-model="state.currencyId"
          :options="currencies"
          label="Currency"
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
          label="Modify"
          @click="onModify"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { getCurrencies } from "src/store/currency";
import {
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from "src/store/bank";
import { v4 as uuid } from "uuid";

const $q = useQuasar();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  account: {
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

const currencies = ref([]);

const state = reactive({
  modified: false,
  id: props.account ? props.account.id : "",
  label: props.account ? props.account.label : "",
  bank: props.account ? props.account.bank : "",
  accountNumber: props.account ? props.account.accountNumber : "",
  currencyId: props.account ? props.account.currencyId : "",
});

const labelInput = ref(null);
const bankInput = ref(null);
const numberInput = ref(null);

onMounted(async () => {
  currencies.value = await getCurrencies();
});

const isValid = () => {
  return (
    labelInput.value.validate() ||
    bankInput.value.validate() ||
    numberInput.value.validate() ||
    countryInput.value.validate()
  );
};

const onAdd = async () => {
  if (isValid()) {
    const newAcc = {
      id: uuid(),
      label: state.label,
      bank: state.bank,
      accountNumber: state.accountNumber,
      currencyId: state.currencyId.id,
    };
    const response = await createBankAccount(newAcc);
    if (response.status === 200 || response.status === 201) {
      onDialogOK({
        account: newAcc,
      });
    } else {
      alert("Cannot create account");
      console.log("Cannot create account: ", response);
    }
  }
};

const onModify = async () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure to modify account?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    if (isValid()) {
      const updAcc = {
        id: state.id,
        label: state.label,
        bank: state.bank,
        accountNumber: state.accountNumber,
        currencyId: state.currencyId.id,
      };
      const response = await updateBankAccount(updAcc);
      if (response.status === 200) {
        onDialogOK({
          updated: true,
        });
      } else {
        alert("Cannot update account");
        console.log("Cannot update account: ", response);
      }
    }
  });
};

const onDelete = async () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure to delete account?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const response = await deleteBankAccount(state.id);
    if (response.status === 200) {
      onDialogOK({
        deleted: state.id,
      });
    } else {
      alert("Cannot remove account");
      console.log("Cannot remove account: ", response);
    }
  });
};
</script>
