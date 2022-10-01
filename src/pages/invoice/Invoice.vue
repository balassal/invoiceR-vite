<template>
  <spinner v-if="loading"></spinner>
  <q-page v-else padding>
    <div class="row q-pa-sm justify-between shadow-2 q-mb-sm">
      <div class="q-gutter-xs">
        <q-btn
          color="primary"
          label="Back"
          icon="reply"
          @click="router.push({ name: 'invoices' })"
        />
        <q-btn color="orange" icon="save" label="Save" @click="onSave" />
      </div>
    </div>
    <div class="q-pa-sm shadow-2 q-mb-sm">
      <div class="row justify-between items-center">
        <h5 class="q-px-sm q-py-none q-my-xs">{{ state.name }}</h5>
        <q-badge color="blue">
          {{ state.status }}
        </q-badge>
      </div>
    </div>
    <div class="row q-gutter-xs">
      <q-card bordered class="col">
        <q-card-section>
          <PartnerSelect
            ref="partnerSelect"
            :editable="editable"
            :partner="state.partnerId"
            @update:partner="(newValue) => onChangePartner(newValue)"
          ></PartnerSelect>
          <LanguageSelect
            ref="languageSelect"
            :language="state.invoiceLangId"
            @update:language="(newValue) => (state.invoiceLangId = newValue)"
            :editable="editable"
          ></LanguageSelect>
        </q-card-section>
      </q-card>
      <q-card bordered class="col">
        <q-card-section>
          <DateInvoice
            ref="dateField"
            label="Date"
            :editable="editable"
            v-model="state.invoiceDate"
            @updateDate="state.invoiceDate = $event.value"
            @update:model-value="onChangeInvoiceDate"
          ></DateInvoice>
          <DateInvoice
            ref="deliveryDateField"
            label="Delivery Date"
            :editable="editable"
            v-model="state.deliveryDate"
            @updateDate="state.deliveryDate = $event.value"
          ></DateInvoice>
          <div class="row items-center q-gutter-sm">
            <div class="col-3">Payment Term</div>
            <div class="col">
              <q-select
                label="Days"
                clearable
                dense
                :readonly="!editable"
                :options="terms"
                v-model="state.paymentTherm"
                @update:model-value="onChangeTerm"
              />
            </div>
            <div class="col">
              <DateInvoice
                ref="dueDateField"
                :editable="editable"
                v-model="state.dueDate"
              >
              </DateInvoice>
            </div>
          </div>
          <PaymentMethod
            ref="paymentMethodField"
            :editable="editable"
            v-model="state.paymentMode"
            @update:model-value="(newValue) => (state.paymentMode = newValue)"
          ></PaymentMethod>
          <div class="row items-center q-gutter-sm">
            <div class="col-3">Currency</div>
            <div class="col">
              <q-select
                dense
                :readonly="!editable"
                :options="currencies"
                v-model="state.currencyId"
                @update:model-value="onChangeCurrency"
              />
            </div>
            <div class="col">
              <q-input
                label="Rate"
                clearable
                dense
                readonly
                v-model="state.exchangeRate"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-sm shadow-2">
      <InvoiceLines
        :editable="editable"
        :invoiceId="state.id"
        :lines="state.invoiceLines"
        @addNewLine="onAddNewLine($event)"
        @modifyLine="onModifyLine($event)"
        @deleteLine="onDeleteLine($event)"
      ></InvoiceLines>
      <div class="row q-gutter-xs q-mt-sm justify-end">
        <div :class="[state.invoiceLines.lenght > 0 ? 'col-6' : 'col']">
          <q-editor class="fit" v-model="state.notes" min-height="5rem" />
        </div>
        <q-card v-if="state.invoiceLines.length > 0" bordered class="col-6">
          <q-card-section>
            <div class="row items-center justify-end q-my-sm q-py-sm">
              <div class="col-3">Net Amount</div>
              <div class="col-6 text-right">
                {{ state.netAmount.toLocaleString("hu-HU", currencyOptions) }}
              </div>
            </div>
            <div
              v-for="tax in state.taxesByLabel"
              :key="tax.label"
              class="row items-center justify-end q-my-sm q-py-sm"
            >
              <div class="col-3">{{ tax.label }}</div>
              <div class="col-6 text-right">
                {{ tax.value.toLocaleString("hu-HU", currencyOptions) }}
              </div>
            </div>
            <div class="row items-center justify-end q-my-sm q-py-sm">
              <div class="col-3">Total Amount</div>
              <div class="col-6 text-right">
                {{ state.totalAmount.toLocaleString("hu-HU", currencyOptions) }}
              </div>
            </div>
            <div class="row items-center justify-end q-my-sm q-py-sm">
              <div class="col-3">Rounding</div>
              <div class="col-6 text-right">
                <q-select
                  dense
                  :readonly="!editable"
                  :options="roundings"
                  v-model="state.rounding"
                  @update:model-value="onRoundingChanged"
                />
              </div>
            </div>
            <div class="row items-center justify-end q-my-sm q-py-sm">
              <div class="col-3"><strong>To be paid</strong></div>
              <div class="col-6 text-right">
                {{ state.toBePaid.toLocaleString("hu-HU", currencyOptions) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="q-my-sm q-pa-md" bordered>
      <p class="text-subtitle1">Messages</p>
      <q-btn
        class="q-mb-sm"
        color="primary"
        icon="add"
        label="Add new"
        size="sm"
        @click="newMessage = true"
      />
      <q-dialog v-model="newMessage">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <div class="text-h6">Your message</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-editor v-model="editorText" min-height="5rem" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add message" v-close-popup @click="addMessage" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-card
        class="q-mb-sm"
        bordered
        v-for="message in state.messages"
        :key="message.id"
      >
        <q-card-section horizontal>
          <q-card-section class="fit">
            <div class="row justify-between items-center">
              <p class="q-mb-none">
                {{ message.uploaded }} <span>by {{ message.uploader }}</span>
              </p>
              <q-card-actions horizontal class="justify-around q-pa-none">
                <q-btn flat round color="primary" icon="reply" />
                <q-btn flat round color="red" icon="delete" />
                <q-btn flat round color="accent" icon="edit" />
              </q-card-actions>
            </div>
            <q-card-section v-html="message.content"></q-card-section>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-my-sm">
      <pre>{{ state }}</pre>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { date } from "quasar";
import { v4 as uuid } from "uuid";
import { getCurrencies } from "src/store/currency";

import PartnerSelect from "../../components/PartnerSelect.vue";
import LanguageSelect from "../../components/LanguageSelect.vue";
import DateInvoice from "src/components/DateInvoice.vue";
import PaymentMethod from "src/components/PaymentMethod.vue";
import InvoiceLines from "src/components/InvoiceLines.vue";
import { createDraftInvoice, getInvoiceById } from "src/store/invoice";
import { useRoute, useRouter } from "vue-router";
import Spinner from "src/components/Spinner.vue";

const loading = ref(false);

const router = useRouter();
const route = useRoute();

const editable = ref(true);
const currencies = ref(null);

const partnerSelect = ref(null);
const languageSelect = ref(null);
const dateField = ref(null);
const dueDateField = ref(null);
const paymentMethodField = ref(null);
const deliveryDateField = ref(null);

const terms = [0, 1, 5, 8, 10, 15, 20, 30];
const roundings = ["None", 0, 1, 5];

const state = reactive({
  id: "",
  name: "Draft",
  partnerId: null,
  invoiceBankId: null,
  paymentMode: "",
  paymentTherm: "",
  dueDate: "",
  invoiceLangId: null,
  invoiceDate: "",
  deliveryDate: "",
  currencyId: null,
  exchangeRate: 1,
  invoiceLines: [],
  taxesByLabel: [],
  netAmount: 0,
  totalAmount: 0,
  vatAmount: 0,
  toBePaid: 0,
  notes: "",
  rounding: "None",
  messages: [],
  status: "new",
});

const currencyOptions = {
  style: "currency",
  currency: "HUF",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const newMessage = ref(false);
const editorText = ref("");
const addMessage = () => {
  const newMsg = {
    id: uuid(),
    content: editorText.value,
    uploader: "Lacika",
    uploaded: new Date().toLocaleString(),
  };
  state.messages.unshift(newMsg);
  editorText.value = "";
};

onMounted(async () => {
  loading.value = true;
  if (route.params.id && route.params.id !== "new") {
    const invoice = await getInvoiceById(route.params.id);
    console.log("invoice :>> ", invoice);
    for (const property in invoice) {
      state[property] = invoice[property];
    }
  }
  currencies.value = await getCurrencies();
  state.currencyId = currencies.value[0];
  loading.value = false;
});

const onChangePartner = (newValue) => {
  const partner = JSON.parse(newValue);
  state.partnerId = partner;
  state.invoiceBankId = partner.bankAccountIds[0];
  state.paymentMode = partner.paymentMethod;
  state.paymentTherm = partner.paymentTherm;
  state.invoiceBankId = partner.bankAccountIds[0];
  onChangeTerm();
};

const onChangeTerm = () => {
  if (state.invoiceDate !== "") {
    const newDate = new Date(state.invoiceDate);
    newDate.setDate(newDate.getDate() + state.paymentTherm);
    state.dueDate = date.formatDate(newDate, "YYYY-MM-DD");
  }
};

const onChangeInvoiceDate = () => {
  onChangeTerm();
};

const onChangeCurrency = () => {
  state.exchangeRate = state.currencyId.rates[0].exchange;
  currencyOptions.currency = state.currencyId.label;
};

const onAddNewLine = ({ line }) => {
  state.invoiceLines.push(line);
  calculateAmounts();
};

const onModifyLine = ({ line }) => {
  const index = state.invoiceLines.findIndex((l) => l.id === line.id);
  state.invoiceLines[index] = line;
  calculateAmounts();
};

const onDeleteLine = ({ id }) => {
  const index = state.invoiceLines.findIndex((l) => l.id === id);
  state.invoiceLines.splice(index, 1);
  calculateAmounts();
};

const onRoundingChanged = () => {
  switch (state.rounding) {
    case "None":
      state.toBePaid = state.totalAmount;
      break;
    case 0:
      const paid = Math.floor(state.totalAmount / 10) * 10;
      state.toBePaid = paid;
      break;
    case 1:
      state.toBePaid = Math.floor(state.totalAmount);
      break;
    case 5:
      state.toBePaid = Math.round(state.totalAmount / 5) * 5;
      break;
  }
};

const calculateAmounts = () => {
  if (state.invoiceLines.length > 0) {
    state.taxesByLabel = [];
    let netAmount = 0;
    let total = 0;
    state.invoiceLines.forEach((line) => {
      netAmount += line.netAmount;

      line.taxesIds.forEach((taxesId) => {
        const index = state.taxesByLabel.findIndex(
          (t) => t.label === taxesId.label
        );
        if (index >= 0) {
          state.taxesByLabel[index].value +=
            line["netAmount"] * taxesId["amount"];
        } else {
          state.taxesByLabel.push({
            label: taxesId["label"],
            value: line["netAmount"] * taxesId["amount"],
          });
        }
      });

      total += line.total;
    });
    state.netAmount = netAmount;
    state.totalAmount = total;
    state.vatAmount = state.totalAmount - state.netAmount;
    onRoundingChanged();
  }
};

const hasAnyError = () => {
  let anyError = false;
  if (!partnerSelect.value.isValid()) anyError = true;
  if (!dateField.value.isValid()) anyError = true;
  if (!deliveryDateField.value.isValid()) anyError = true;
  if (!dueDateField.value.isValid()) anyError = true;
  if (!paymentMethodField.value.isValid()) anyError = true;

  return anyError;
};

const onSave = async () => {
  if (!hasAnyError()) {
    const newInvoice = {
      id: uuid(),
      name: "Draft",
      partnerId: state.partnerId.id,
      invoiceDate: state.invoiceDate,
      deliveryDate: state.deliveryDate,
      dueDate: state.dueDate,
      paymentTherm: state.paymentTherm,
      paymentMode: state.paymentMode,
      invoiceBankId: state.invoiceBankId.id,
      currencyId: state.currencyId.id,
      exchangeRate: state.exchangeRate,
      invoiceLangId: state.invoiceLangId.id,
      netAmount: state.netAmount,
      vatAmount: state.vatAmount,
      totalAmount: state.totalAmount,
      toBePaid: state.toBePaid,
      rounding: state.rounding,
      invoiceLines: JSON.parse(JSON.stringify(state.invoiceLines)),
      notes: state.notes,
      status: "draft",
      messages: JSON.parse(JSON.stringify(state.messages)),
    };
    const response = await createDraftInvoice(newInvoice);
    if (response.status == 201) {
      router.push({ name: "invoices" });
    } else {
      alert("Cannot create draft invoice");
      console.log("Cannot create draft invoice: ", response);
    }
  }
};
</script>
