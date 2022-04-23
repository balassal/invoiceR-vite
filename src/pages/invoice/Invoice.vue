<template>
  <q-page class="q-pa-sm">
    <div class="row q-pa-sm justify-between shadow-2">
      <div class="q-gutter-xs">
        <q-btn color="primary" icon="add" label="New" to="new" />
        <q-btn
          style="background: goldenrod; color: white"
          icon="edit"
          @click="onEditSave"
          >{{ editable ? "Save" : "Edit" }}</q-btn
        >
        <q-btn color="secondary" icon="done" label="Approve" />
        <q-btn-dropdown label="Actions">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Print</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="print" />
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Delete</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="delete" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <div class="q-pa-sm shadow-2">
      <div class="row justify-between items-center">
        <h4 class="q-px-sm q-py-none q-my-xs">
          {{ invoice ? invoice.number : "Draft" }}
        </h4>
        <q-badge>
          <span class="text-subtitle2 q-px-sm q-py-none q-my-xs">{{ state.state }}</span>
        </q-badge>
      </div>
      <div class="row q-gutter-xs">
        <q-card bordered class="col">
          <q-card-section>
            <partner-select
              ref="partnerSelect"
              :editable="editable"
              :partner="state.partnerId"
              @update:partner="(newValue) => onChangePartner(newValue)"
              :bank="state.invoiceBankId"
              @update:bank="(newValue) => onChangeBankId(newValue)"
            ></partner-select>
            <language-select
              ref="languageSelect"
              :language="state.invoiceLangId"
              @update:language="(newValue) => state.invoiceLangId = newValue"
              :editable="editable"
            ></language-select>
          </q-card-section>
        </q-card>
        <q-card bordered class="col">
          <q-card-section>
            <date-invoice
              ref="dateField"
              label="Date"
              :editable="editable"
              v-model="state.invoiceDate"
              @updateDate="state.invoiceDate = $event.value"
              @update:model-value="onChangeInvoiceDate"
            ></date-invoice>
            <date-invoice
              ref="deliveryDateField"
              label="Delivery Date"
              :editable="editable"
              v-model="state.deliveryDate"
              @updateDate="state.deliveryDate = $event.value"
            ></date-invoice>
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
                <date-invoice
                  ref="dueDateField"
                  :editable="editable"
                  v-model="state.dueDate"
                >
                </date-invoice>
              </div>
            </div>
            <payment-method
              ref="paymentMethodField"
              :editable="editable"
              v-model="state.paymentMode"
              @update:model-value="(newValue) => state.paymentMode = newValue"
            >
            </payment-method>
            <div class="row items-center q-gutter-sm">
              <div class="col-3">Currency</div>
              <div class="col">
                <q-select
                  clearable
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
    </div>
    <div class="q-pa-sm shadow-2">
      <invoice-lines
        :editable="editable"
        :invoiceId="state.id"
        :lines="state.invoiceLines"
        @addNewLine="onAddNewLine($event)"
        @modifyLine="onModifyLine($event)"
        @deleteLine="onDeleteLine($event)"
      >
      </invoice-lines>
      <div class="row q-gutter-xs q-mt-sm justify-end">
        <div :class="[state.invoiceLines.lenght > 0 ? 'col-6' : 'col' ]">
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
            <div v-for="tax in state.taxesByLabel" :key="tax.label" class="row items-center justify-end q-my-sm q-py-sm">
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
        <q-btn class="q-mb-sm" color="primary" icon="add" label="Add new" size="sm" @click="newMessage = true" />
        <q-dialog v-model="newMessage">
          <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
              <div class="text-h6">Your message</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-editor v-model="editorText" min-height="5rem" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Add message" v-close-popup @click="addMessage"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-card class="q-mb-sm" bordered v-for="message in state.messages" :key="message.id">
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
    <!-- <div class="q-pa-sm shadow-2">
      <pre>{{ state }}</pre>
    </div> -->
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { date } from "quasar";
import { useRoute } from "vue-router";
import { createDraftInvoice, getInvoiceById } from "../../store/invoice";
import { getCurrencies } from "../../store/currency";
import { v4 as uuid } from "uuid";

import PartnerSelect from "../../components/PartnerSelect.vue";
import LanguageSelect from "../../components/LanguageSelect.vue";
import DateInvoice from "../../components/DateInvoice.vue";
import PaymentMethod from "../../components/PaymentMethod.vue";
import InvoiceLines from "../../components/InvoiceLines.vue";

const route = useRoute();
const isNewOrId = computed(() => {
  return route.params.id ? route.params.id : "new";
});
const editable = computed(() => isNewOrId.value === "new");
const invoice = computed(() => {
  return route.params.id ? getInvoiceById(route.params.id) : null;
});
const currencies = ref(null);

const partnerSelect = ref(null);
const languageSelect = ref(null);
const dateField = ref(null);
const deliveryDateField = ref(null);
const dueDateField = ref(null);
const paymentMethodField = ref(null);
const invoiceLines = ref([]);

const timeStamp = Date.now();
const formattedString = date.formatDate(timeStamp, "YYYY-MM-DD");
const terms = [0, 1, 5, 8, 10, 15, 20, 30];
const roundings = ["None", 0, 1, 5];

const state = reactive({
  id: invoice.value ? invoice.value.id : uuid(),
  name: invoice.value ? invoice.value.name : "",
  number: invoice.value ? invoice.value.number : "",
  partnerId: invoice.value ? invoice.value.partnerId : "",
  invoiceDate: invoice.value ? invoice.value.invoiceDate : "",
  deliveryDate: invoice.value ? invoice.value.deliveryDate : "",
  invoiceLangId: invoice.value ? invoice.value.invoiceLangId : "",
  invoiceBankId: invoice.value ? invoice.value.invoiceBankId : "",
  currencyId: invoice.value ? invoice.value.currencyId : "",
  exchangeRate: invoice.value ? invoice.value.exchangeRate : 1,
  netAmount: invoice.value ? invoice.value.netAmount : 0,
  vatAmount: invoice.value ? invoice.value.vatAmount : 0,
  totalAmount: invoice.value ? invoice.value.totalAmount : 0,
  rounding: invoice.value ? invoice.value.rounding : "None",
  invoiceLines: invoice.value ? invoice.value.invoiceLines : [],
  paymentTherm: invoice.value ? invoice.value.paymentTherm : 0,
  dueDate: invoice.value ? invoice.value.dueDate : "",
  paymentMode: invoice.value ? invoice.value.paymentMode : "",
  taxesByLabel: [],
  toBePaid: invoice.value ? invoice.value.toBePaid : 0,
  notes: invoice.value ? invoice.value.notes : "",
  messages: invoice.value ? invoice.value.messages : [],
  state: invoice.value ? invoice.value.state : "new"
})

const currencyOptions = {
  style: "currency",
  currency: "HUF",
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2
}

const newMessage = ref(false);
const editorText = ref("");
const addMessage = () => {
  const newMsg = {
    id: uuid(),
    content: editorText.value,
    uploader: "Lacika",
    uploaded: new Date().toLocaleString()
  }
  state.messages.unshift(newMsg);
  editorText.value = "";
}

onMounted(() => {
  if (invoice.value) {
    calculateAmounts();
  } else {
    currencies.value = getCurrencies();
    state.invoiceDate = formattedString;
    state.deliveryDate = formattedString;
    state.currencyId = currencies.value[0];
    onChangeCurrency();
  }
});

const onChangeTerm = () => {
  if (state.invoiceDate !== "") {
    const newDate = new Date(state.invoiceDate);
    newDate.setDate(newDate.getDate() + state.paymentTherm);
    state.dueDate = date.formatDate(newDate, "YYYY-MM-DD");
  }
}

const onChangeInvoiceDate = () => {
  onChangeTerm();
}

const onChangeCurrency = () => {
  state.exchangeRate = state.currencyId.rates[0].exchange;
  currencyOptions.currency = state.currencyId.label;
};

const onChangePartner = (newValue) => {
  const partner = JSON.parse(newValue);
  state.partnerId = partner;
  state.invoiceBankId = partner.bankAccountIds[0];
  state.paymentMode = partner.paymentMethod;
  state.paymentTherm = partner.paymentTherm;
  onChangeTerm();
}

const onChangeBankId = (newValue) => {
  const bankId = JSON.parse(newValue);
  state.invoiceBankId = bankId;
}

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

}

const hasAnyError = () => {
  let anyError = false;
  if (!partnerSelect.value.isValid()) anyError = true;
  if (!languageSelect.value.isValid()) anyError = true;
  if (!dateField.value.isValid()) anyError = true;
  if (!deliveryDateField.value.isValid()) anyError = true;
  if (!dueDateField.value.isValid()) anyError = true;
  if (!paymentMethodField.value.isValid()) anyError = true;

  return anyError;
};

const onEditSave = () => {
  if (state.state !== "new") return;

  if (!hasAnyError()) {
    editable.value = !editable.value;

    createDraftInvoice(JSON.stringify(state));
  }
};

const onAddNewLine = (event) => {
  const newLine = JSON.parse(event);
  state.invoiceLines.push(newLine);
  calculateAmounts();
}

const onModifyLine = (event) => {
  const modifiedLine = JSON.parse(event);
  const lineIndex = state.invoiceLines.findIndex(l => l.id === modifiedLine.id);
  if (lineIndex >= 0) {
    state.invoiceLines[lineIndex] = modifiedLine;
  }
  calculateAmounts();
}

const onDeleteLine = (event) => {
  const index = state.invoiceLines.findIndex(l => l.id === event);
  state.invoiceLines.splice(index, 1);
  calculateAmounts();
}

const calculateAmounts = () => {
  if (state.invoiceLines.length > 0) {
    state.taxesByLabel = [];
    let netAmount = 0;
    let total = 0;
    state.invoiceLines.forEach(line => {
      netAmount += line.netAmount;

      line.taxesIds.forEach(taxesId => {
        const index = state.taxesByLabel.findIndex(t => t.label === taxesId.label);
        if (index >= 0) {
          state.taxesByLabel[index].value += (line["netAmount"] * taxesId["amount"]);
        } else {
          state.taxesByLabel.push({label: taxesId["label"], value: line["netAmount"] * taxesId["amount"]});
        }
      });

      total += line.total;
    });
    state.netAmount = netAmount;
    state.totalAmount = total;
    state.vatAmount = state.totalAmount - state.netAmount;
    onRoundingChanged();
  }
}
</script>
