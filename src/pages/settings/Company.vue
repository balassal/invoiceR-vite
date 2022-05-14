<template>
  <spinner v-if="loading"></spinner>
  <q-page v-else padding>
    <q-btn
      v-if="changed"
      class="q-mb-sm"
      label="Save changes"
      color="orange"
      outline
      @click="onSave"
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
          v-model="company.name"
          @update:model-value="changed = true"
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
          v-model="company.shortName"
          @update:model-value="changed = true"
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
          v-model="company.vatnumber"
          @update:model-value="changed = true"
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
          v-model="company.currencyId"
          :rules="currRules"
          @update:model-value="changed = true"
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
          v-model="company.languageId"
          :rules="langRules"
          @update:model-value="changed = true"
        />
      </div>
    </div>
    <div class="text-h6 q-mt-xl">
      <q-icon name="import_contacts" size="sm" />
      Addresses
    </div>
    <div class="row q-pa-md q-gutter-sm items-center">
      <q-card
        v-for="address in company.addressIds"
        :key="address.id"
        class="q-pa-sm cursor-pointer"
        @click="modifyAddressModal(address)"
      >
        <q-card-section>
          <div class="text-center">
            <q-icon
              :name="getAddressIcon(address.type)"
              size="md"
              :title="address.type"
            />
          </div>
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
        v-for="bankAcc in company.bankAccountIds"
        :key="bankAcc.id"
        class="q-pa-sm cursor-pointer"
        @click="modifyBankModal(bankAcc)"
      >
        <q-card-section>
          <div class="q-mb-sm text-center">
            <q-icon name="account_balance" size="sm" />
            <span class="q-ml-sm">{{ bankAcc.currencyId.label }}</span>
          </div>
          <div class="text-subtitle2">{{ bankAcc.label }}</div>
          <div class="text-overline">{{ bankAcc.bank }}</div>
          <div class="text-weight-bold">{{ bankAcc.accountNumber }}</div>
        </q-card-section>
      </q-card>
      <q-btn
        round
        color="primary"
        icon="add"
        size="md"
        class="addBtn q-ml-lg"
        @click="showBankModal"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { v4 as uuid } from "uuid";
import { useQuasar } from "quasar";
import AddressDialog from "src/components/AddressDialog.vue";
import BankDialog from "src/components/BankDialog.vue";
import { getCompanyDetails, saveCompany } from "src/store/company";
import { getCurrencies } from "src/store/currency";
import { getLanguages } from "src/store/language";
import Spinner from "src/components/Spinner.vue";

const $q = useQuasar();
const company = ref({});
const currencies = ref([]);
const languages = ref([]);
const changed = ref(false);
const loading = ref(false);

onMounted(async () => {
  await loadDatas();
});

const nameRules = [(val) => (val && val.length > 0) || "Name can't be empty!"];
const vatRules = [(val) => (val && val.length > 0) || "VAT can't be empty!"];
const currRules = [(val) => !!val || "Please select a Currency!"];
const langRules = [(val) => !!val || "Please select a Language!"];

const loadDatas = async () => {
  loading.value = true;
  company.value = await getCompanyDetails();
  currencies.value = await getCurrencies();
  languages.value = await getLanguages();
  loading.value = false;
};

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
    company.value.addressIds.push(newAddress);
    changed.value = true;
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
      const found = company.value.addressIds.find((a) => a.id === data.id);
      found.active = data.active;
      found.city = data.city;
      found.street = data.street;
      found.country = data.country;
      found.type = data.type;
      found.zip = data.zip;
    } else {
      if (confirm("Are you sure to remove this address?")) {
        company.value.addressIds = company.value.addressIds.filter(
          (a) => a.id !== data.deleteId
        );
      }
    }

    changed.value = true;
  });
};

const showBankModal = () => {
  $q.dialog({
    component: BankDialog,
    componentProps: {
      title: "Add Bank Account",
      mode: "add",
    },
  }).onOk((data) => {
    const newAcc = {
      id: uuid(),
      label: data.label,
      bank: data.bank,
      accountNumber: data.accountNumber,
      currencyId: data.currencyId,
    };
    company.value.bankAccountIds.push(newAcc);
    changed.value = true;
  });
};

const modifyBankModal = (bank) => {
  $q.dialog({
    component: BankDialog,
    componentProps: {
      title: "Modify Bank Account",
      mode: "edit",
      account: bank,
    },
  }).onOk((data) => {
    if (!Object.keys(data).includes("deleteId")) {
      const found = company.value.bankAccountIds.find((b) => b.id === data.id);
      found.label = data.label;
      found.bank = data.bank;
      found.accountNumber = data.accountNumber;
      found.currencyId = data.currencyId;
    } else {
      if (confirm("Are you sure to remove this account?")) {
        company.value.bankAccountIds = company.value.bankAccountIds.filter(
          (a) => a.id !== data.deleteId
        );
      }
    }
    changed.value = true;
  });
};

const onSave = async () => {
  const response = await saveCompany(JSON.stringify(company.value));
  if (response.status === 200) {
    loadDatas();
    changed.value = false;
  } else {
    console.log(response);
    changed.value = false;
  }
};
</script>

<style lang="scss">
.addBtn {
  width: 40px;
  height: 40px;
}
</style>
