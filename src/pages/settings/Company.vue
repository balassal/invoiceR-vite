<template>
  <q-page padding>
    <q-btn
      v-if="state.changed"
      class="q-mb-sm"
      label="Save changes"
      color="orange"
      outline
    />
    <div class="text-h6">
      <q-icon name="business" size="sm" />
      Company Details
    </div>
    <div class="row items-center q-pa-sm">
      <div class="col-3">
        <strong>Name</strong>
      </div>
      <div class="col-9">
        <q-input
          clearable
          dense
          class="q-pb-none"
          :rules="nameRules"
          v-model="state.name"
          @update:model-value="state.changed = true"
        />
      </div>
    </div>
    <div class="row items-center q-pa-sm">
      <div class="col-3">
        <strong> Short Name </strong>
      </div>
      <div class="col-9">
        <q-input
          clearable
          dense
          class="q-pb-none"
          v-model="state.shortName"
          @update:model-value="state.changed = true"
        />
      </div>
    </div>
    <div class="row items-center q-pa-sm">
      <div class="col-3">
        <strong> VAT Number </strong>
      </div>
      <div class="col-9">
        <q-input
          clearable
          dense
          class="q-pb-none"
          :rules="vatRules"
          v-model="state.vat"
          @update:model-value="state.changed = true"
        />
      </div>
    </div>
    <div class="row items-center q-pa-sm">
      <div class="col-3">
        <strong> Currency </strong>
      </div>
      <div class="col-9">
        <q-select
          clearable
          class="q-pb-none"
          dense
          :options="currencies"
          v-model="state.currency"
          :rules="currRules"
          @update:model-value="state.changed = true"
        />
      </div>
    </div>
    <div class="row items-center q-pa-sm">
      <div class="col-3">
        <strong> Languages </strong>
      </div>
      <div class="col-9">
        <q-select
          clearable
          class="q-pb-none"
          dense
          :options="languages"
          v-model="state.language"
          :rules="langRules"
          @update:model-value="state.changed = true"
        />
      </div>
    </div>
    <div class="text-h6 q-mt-xl">
      <q-icon name="import_contacts" size="sm" />
      Addresses
    </div>
    <div class="row q-pa-md q-gutter-sm items-center">
      <q-card
        v-for="address in state.addresses"
        :key="address.id"
        class="q-pa-sm cursor-pointer"
        @click="modifyAddressModal(address)"
      >
        <q-card-section>
          <q-icon
            :name="getAddressIcon(address.type)"
            size="md"
            :title="address.type"
          />
          <div class="text-subtitle1 text-no-wrap">{{ address.street }}</div>
          <div class="text-subtitle2">
            {{ address.zip }}, {{ address.city }}
          </div>
          <div class="text-overline">{{ address.country }}</div>
        </q-card-section>
      </q-card>
      <q-btn
        round
        color="primary"
        icon="add"
        size="md"
        class="addBtn q-ml-lg"
        @click="showAddressModal"
      />
    </div>
    <div class="text-h6 q-mt-xl">
      <q-icon name="account_balance" size="sm" />
      Bank Accounts
    </div>
    <div class="row q-pa-md q-gutter-sm items-center">
      <q-card
        v-for="bankAcc in state.bankAccounts"
        :key="bankAcc.id"
        class="q-pa-sm cursor-pointer"
      >
        <q-card-section>
          <div class="text-subtitle2">{{ bankAcc.bank }}</div>
          <div class="text-overline">{{ bankAcc.label }}</div>
          <div class="text-weight-bold">{{ bankAcc.accountNumber }}</div>
        </q-card-section>
      </q-card>
      <q-btn
        round
        color="primary"
        icon="add"
        size="md"
        class="addBtn q-ml-lg"
      />
    </div>
    <pre class="q-mt-xl">{{ state }}</pre>
  </q-page>
</template>

<script setup>
import { computed, reactive } from "vue";
import { v4 as uuid } from "uuid";
import { getCompanyDetails } from "src/store/company";
import { getAddressById } from "src/store/address";
import { getBankAccountById } from "src/store/bank";
import { getCurrencies, getCurrencyById } from "src/store/currency";
import { getLanguages, getLangById } from "src/store/language";
import { useQuasar } from "quasar";
import AddressDialog from "src/components/AddressDialog.vue";

const $q = useQuasar();
const company = computed(() => getCompanyDetails());
const currencies = computed(() => getCurrencies());
const languages = computed(() => getLanguages());

const state = reactive({
  changed: false,
  name: company.value.name,
  shortName: company.value.shortName,
  vat: company.value.vatnumber,
  addresses: company.value.addressIds.map((id) => getAddressById(id)),
  bankAccounts: company.value.bankAccountIds.map((id) =>
    getBankAccountById(id)
  ),
  currency: getCurrencyById(company.value.currencyId),
  language: getLangById(company.value.languageId),
});

const nameRules = [(val) => (val && val.length > 0) || "Name can't be empty!"];
const vatRules = [(val) => (val && val.length > 0) || "VAT can't be empty!"];
const currRules = [(val) => !!val || "Please select a Currency!"];
const langRules = [(val) => !!val || "Please select a Language!"];

const getAddressIcon = (type) => {
  let icon = "home";
  if (type === "invoice") icon = "receipt";
  if (type === "delivery") icon = "local_shipping";
  return icon;
};

const showAddressModal = () => {
  $q.dialog({
    component: AddressDialog,
    componentProps: {
      title: "Add new address",
      mode: "add",
    },
  }).onOk((data) => {
    const newAddress = {
      id: uuid(),
      active: true,
      street: data.address,
      zip: data.zip,
      city: data.city,
      country: data.country,
      type: data.type,
    };
    state.addresses.push(newAddress);
    state.changed = true;
  });
};
const modifyAddressModal = (address) => {
  $q.dialog({
    component: AddressDialog,
    componentProps: {
      title: "Modify address",
      mode: "edit",
      address: address,
    },
  }).onOk((data) => {
    if (!Object.keys(data).includes("deleteId")) {
      const found = state.addresses.find((a) => a.id === data.id);
      found.active = data.active;
      found.city = data.city;
      found.street = data.street;
      found.country = data.country;
      found.type = data.type;
      found.zip = data.zip;
    } else {
      if (confirm("Are you sure to remove this address?")) {
        state.addresses = state.addresses.filter((a) => a.id !== data.deleteId);
      }
    }

    state.changed = true;
  });
};
</script>

<style lang="scss">
.addBtn {
  width: 40px;
  height: 40px;
}
</style>
