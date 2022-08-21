<template>
  <spinner v-if="loading"></spinner>
  <q-page v-else padding>
    <div class="q-pa-sm shadow-2">
      <div class="row q-pa-sm q-gutter-sm">
        <q-btn color="primary" label="Back" to="list" icon="reply" />
        <q-btn
          v-if="!editMode"
          color="orange"
          label="Edit"
          icon="edit"
          @click="editMode = true"
        />
        <q-btn
          v-if="editMode && !canCreate"
          color="orange"
          label="Save"
          icon="save"
          @click="onSave"
        />
        <q-btn
          v-if="editMode && canCreate"
          color="secondary"
          label="Create"
          icon="add_circle_outline"
          @click="onCreate"
        />
        <q-btn
          v-if="canDelete"
          label="Delete"
          icon="delete"
          color="red"
          @click="onDelete"
        />
      </div>
      <template v-if="partner">
        <div class="row q-pa-sm q-gutter-sm items-center justify-between">
          <div class="col-xs-12 col-sm-6 col-md-10">
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-sm">
              <span
                class="text-caption q-ma-none q-mr-lg text-no-wrap text-weight-bold"
                >Name:</span
              >
              <span v-if="!editMode" class="text-h6">{{ partner.name }}</span>
              <q-input
                ref="nameField"
                v-else
                class="fit"
                dense
                color="primary"
                v-model="partner.name"
                hint="Name is required"
                :rules="[(val) => !!val || 'Name is required!']"
                lazy-rules="ondemand"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm col-md">
            <q-checkbox
              class="q-ma-none"
              v-model="partner.active"
              label="Active"
              :disable="!editMode"
            />
          </div>
        </div>
        <div class="row q-pa-sm q-gutter-sm justify-between">
          <div class="col-xs-12 col-sm-6">
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-lg text-no-wrap text-weight-bold"
                >Label:</span
              >
              <span v-if="!editMode" class="text-h6">{{ partner.label }}</span>
              <q-input
                v-else
                ref="labelField"
                class="fit"
                dense
                color="primary"
                v-model="partner.label"
                hint="Label is required"
                :rules="[(val) => !!val || 'Label is required!']"
                lazy-rules="ondemand"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-lg text-no-wrap text-weight-bold"
                >Type:</span
              >
              <span v-if="!editMode" class="text-h6">{{ partner.type }}</span>
              <q-select
                v-else
                class="fit"
                ref="typeSelect"
                dense
                color="primary"
                hint="Type is required"
                v-model="partner.type"
                :options="partnerTypes"
                :rules="[(val) => !!val || 'Please select a type']"
                lazy-rules="ondemand"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-lg text-no-wrap text-weight-bold"
                >Tax Number:</span
              >
              <span v-if="!editMode" class="text-h6">{{
                partner.vatnumber
              }}</span>
              <q-input
                v-else
                class="fit"
                dense
                color="primary"
                v-model="partner.vatnumber"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm">
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-lg text-no-wrap text-weight-bold"
                >Currency:</span
              >
              <span v-if="!editMode" class="text-h6">{{
                partner.currencyId.label
              }}</span>
              <q-select
                v-else
                ref="currencySelect"
                class="fit"
                dense
                color="primary"
                option-value="id"
                option-label="label"
                v-model="partner.currencyId"
                hint="Currency is required"
                :options="currencyIds"
                :rules="[(val) => !!val || 'Please select a currency']"
                lazy-rules="ondemand"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-lg text-no-wrap text-weight-bold"
                >Language:</span
              >
              <span v-if="!editMode" class="text-h6">{{
                partner.languageId.label
              }}</span>
              <q-select
                v-else
                ref="languageSelect"
                class="fit"
                dense
                color="primary"
                option-value="id"
                option-label="label"
                v-model="partner.languageId"
                hint="Language is required"
                :options="languageIds"
                :rules="[(val) => !!val || 'Please select a language']"
                lazy-rules="ondemand"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-lg text-no-wrap text-weight-bold"
                >Payment Therm:</span
              >
              <span v-if="!editMode" class="text-h6">{{
                partner.paymentTherm
              }}</span>
              <q-input
                v-else
                class="fit"
                dense
                color="primary"
                v-model.number="partner.paymentTherm"
                type="number"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-lg text-no-wrap text-weight-bold"
                >Payment Method:</span
              >
              <span v-if="!editMode" class="text-h6">{{
                partner.paymentMethod
              }}</span>
              <q-select
                v-else
                ref="paymentMethodSelect"
                class="fit"
                dense
                color="primary"
                v-model="partner.paymentMethod"
                hint="Payment method is required"
                :options="paymentMethods"
                :rules="[(val) => !!val || 'Please select a payment method']"
                lazy-rules="ondemand"
              />
            </div>
          </div>
        </div>
        <div class="text-h6 q-mt-lg q-pl-sm">
          <q-icon name="import_contacts" size="sm" />
          Addresses
        </div>
        <div class="row q-pa-md q-gutter-sm items-center">
          <q-card
            v-for="address in partner.addressIds"
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
              <div class="text-subtitle1 text-no-wrap">
                {{ address.street }}
              </div>
              <div class="text-subtitle2">
                {{ address.zip }}, {{ address.city }}
              </div>
              <div class="text-overline">{{ address.country }}</div>
            </q-card-section>
          </q-card>
          <q-btn
            v-if="editMode"
            round
            color="primary"
            icon="add"
            size="md"
            class="addBtn q-ml-lg"
            @click="showAddressModal"
          />
        </div>
        <div class="text-h6 q-mt-lg q-pl-sm">
          <q-icon name="account_balance" size="sm" />
          Bank Accounts
        </div>
        <div class="row q-pa-md q-gutter-sm items-center">
          <q-card
            v-for="bankAcc in partner.bankAccountIds"
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
            v-if="editMode"
            round
            color="primary"
            icon="add"
            size="md"
            class="addBtn q-ml-lg"
            @click="showBankModal"
          />
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Spinner from "src/components/Spinner.vue";
import { useQuasar } from "quasar";
import { v4 as uuid } from "uuid";
import {
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} from "src/store/partner";
import { getCurrencies } from "src/store/currency";
import { getLanguages } from "src/store/language";
import BankDialog from "src/components/BankDialog.vue";
import AddressDialog from "src/components/AddressDialog.vue";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const partner = ref(null);
const currencyIds = ref([]);
const languageIds = ref([]);
const editMode = ref(false);
const canDelete = ref(false);
const canCreate = ref(false);
const nameField = ref(null);
const labelField = ref(null);

const partnerTypes = ref(["customer", "supplier", "other"]);
const paymentMethods = ref(["transfer", "cash", "card", "other"]);

const paymentMethodSelect = ref(null);
const currencySelect = ref(null);
const typeSelect = ref(null);
const languageSelect = ref(null);

onMounted(async () => {
  if (route.params.id) {
    await loadPartner(route.params.id);
  } else {
    await loadNewPartner();
  }
  await loadCurrencyIds();
  await loadLanguageIds();
});

const loadPartner = async (id) => {
  loading.value = true;
  partner.value = await getPartnerById(id);
  loading.value = false;
  editMode.value = false;
  canDelete.value = true;
};

const loadNewPartner = async () => {
  partner.value = {
    id: uuid(),
    name: "",
    label: "",
    active: true,
    type: "customer",
    vatnumber: "",
    bankAccountIds: [],
    currencyId: "",
    languageId: "",
    paymentMethod: "transfer",
    addressIds: [],
  };
  editMode.value = true;
  canCreate.value = true;
};

const loadCurrencyIds = async () => {
  currencyIds.value = await getCurrencies();
};

const loadLanguageIds = async () => {
  languageIds.value = await getLanguages();
};

const onSave = async () => {
  const response = await updatePartner(partner.value);
  if (response.status === 200) {
    loadPartner(response.data.id);
    editMode.value = false;
  } else {
    alert("Cannot update partner!");
    console.log("Cannot update partner. ", response);
    editMode.value = true;
  }
};

const onDelete = async () => {
  $q.dialog({
    title: "Confirm",
    message: "Would you like to delete partner?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const response = await deletePartner(partner.value.id);
    if (response.status === 200) {
      router.push({ name: "partnerList" });
    } else {
      alert("Cannot delete partner!");
      console.log("Cannot delete partner. ", response);
    }
  });
};

const hasError = () => {
  let anyError = false;
  if (!nameField.value.validate()) anyError = true;
  if (!labelField.value.validate()) anyError = true;
  if (!paymentMethodSelect.value.validate()) anyError = true;
  if (!currencySelect.value.validate()) anyError = true;
  if (!languageSelect.value.validate()) anyError = true;

  return anyError;
};

const onCreate = async () => {
  if (!hasError()) {
    const response = await createPartner(partner.value);
    if (response.status === 200 || response.status === 201) {
      router.push({ name: "partnerList" });
    } else {
      alert("Cannot create partner!");
      console.log("Cannot create partner. ", response);
    }
  }
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
  }).onOk(async ({ address }) => {
    partner.value.addressIds.push(address);
    const response = await updatePartner(partner.value);
    if (response.status === 200) {
      partner.value = await getPartnerById(response.data.id);
    } else {
      alert("Cannot create address!");
      console.log("Cannot create address ", response);
    }
  });
};

const modifyAddressModal = (address) => {
  if (!editMode.value) return;
  $q.dialog({
    component: AddressDialog,
    componentProps: {
      title: "Modify address",
      mode: "edit",
      address: address,
    },
  }).onOk(async (data) => {
    const keys = Object.keys(data);
    if (keys.includes("deleted")) {
      partner.value.addressIds = partner.value.addressIds.filter(
        (addr) => addr.id !== data.deleted
      );
    }
    const response = await updatePartner(partner.value);
    if (response.status === 200) {
      partner.value = await getPartnerById(response.data.id);
    } else {
      alert("Cannot modify address!");
      console.log("Cannot modify address ", response);
    }
  });
};

const showBankModal = () => {
  $q.dialog({
    component: BankDialog,
    componentProps: {
      title: "Add Bank Account",
      mode: "add",
    },
  }).onOk(async ({ account }) => {
    partner.value.bankAccountIds.push(account);
    const response = await updatePartner(partner.value);
    if (response.status === 200) {
      partner.value = await getPartnerById(response.data.id);
    } else {
      alert("Cannot create account!");
      console.log("Cannot create account ", response);
    }
  });
};

const modifyBankModal = (bank) => {
  if (!editMode.value) return;
  $q.dialog({
    component: BankDialog,
    componentProps: {
      title: "Modify Bank Account",
      mode: "edit",
      account: bank,
    },
  }).onOk(async (data) => {
    const keys = Object.keys(data);
    if (keys.includes("deleted")) {
      partner.value.bankAccountIds = partner.value.bankAccountIds.filter(
        (acc) => acc.id !== data.deleted
      );
    }
    const response = await updatePartner(partner.value);
    if (response.status === 200) {
      partner.value = await getPartnerById(response.data.id);
    } else {
      alert("Cannot modify account!");
      console.log("Cannot modify account ", response);
    }
  });
};
</script>
