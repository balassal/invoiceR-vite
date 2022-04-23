<template>
  <q-page class="q-pa-sm">
    <div class="row q-pa-sm justify-between shadow-2">
      <div class="q-gutter-xs">
        <q-btn color="primary" icon="add" label="New" to="new" />
        <q-btn
          style="background: goldenrod; color: white"
          icon="edit"
          label="Edit"
        />
        <q-btn color="secondary" icon="done" label="Approve" />
        <q-btn-dropdown label="Actions">
          <q-list>
            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>Print</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="print" />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="onItemClick"
              active-class="text-orange"
            >
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
      <h4 class="q-px-sm q-py-none q-my-xs">Invoice</h4>
      <p class="text-subtitle1 q-px-sm q-py-none q-my-xs">
        {{ invoice.name }}
      </p>
      <div class="row q-gutter-xs">
        <q-card bordered class="col">
          <q-card-section>
            <table class="fit">
              <tbody>
                <tr>
                  <th class="text-left">Partner</th>
                  <td class="text-subtitle1">{{ invoice.partnerId.label }}</td>
                </tr>
                <tr>
                  <th class="text-left">VAT</th>
                  <td class="text-subtitle1">{{ invoice.partnerId.vatnumber }}</td>
                </tr>
                <tr>
                  <th class="text-left">Address</th>
                  <td class="text-subtitle1">
                    {{ invoice.partnerId.addressIds[0].country }},
                    {{ invoice.partnerId.addressIds[0].zip }}
                    {{ invoice.partnerId.addressIds[0].city }},
                    {{ invoice.partnerId.addressIds[0].street }}
                  </td>
                </tr>
                <tr>
                  <th class="text-left">Invoice Language</th>
                  <td class="text-subtitle1">
                    {{ invoice.invoiceLangId.label }}
                  </td>
                </tr>
                <tr>
                  <th class="text-left">Bank Account</th>
                  <td class="text-subtitle1">
                    {{ invoice.partnerId.bankAccountIds[0].label }},
                    {{ invoice.partnerId.bankAccountIds[0].accountNumber }}
                    </td>
                </tr>
              </tbody>
            </table>
          </q-card-section>
        </q-card>
        <q-card bordered class="col">
          <q-card-section>
            <table class="fit">
                <tbody>
                  <tr>
                    <th class="text-left">Date</th>
                    <td class="text-subtitle1">{{ invoice.invoiceDate }}</td>
                  </tr>
                  <tr>
                    <th class="text-left">Delivery Date</th>
                    <td class="text-subtitle1">{{ invoice.deliveryDate }}</td>
                  </tr>
                  <tr>
                    <th class="text-left">Due Date</th>
                    <td class="text-subtitle1">{{ invoice.dueDate }}</td>
                  </tr>
                  <tr>
                    <th class="text-left">Payment</th>
                    <td class="text-subtitle1">{{ invoice.paymentMode }}</td>
                  </tr>
                  <tr>
                    <th class="text-left">Currency</th>
                    <td class="text-subtitle1">{{ invoice.currencyId.label }}</td>
                  </tr>
                  <tr v-if="invoice.exchangeRate != 1">
                    <th class="text-left">Rate</th>
                    <td class="text-subtitle1">{{ invoice.exchangeRate }}</td>
                  </tr>
                </tbody>
              </table>
          </q-card-section>
        </q-card>
      </div>
      <q-card class="q-my-sm q-pa-sm" bordered>
        <q-markup-table separator="horizontal" flat bordered class="fit">
          <thead>
            <th class="text-center">#</th>
            <th class="text-left">Product</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Net Amount</th>
            <th class="text-right">Taxes</th>
            <th class="text-right">Tax Amount</th>
            <th class="text-right">Total</th>
          </thead>
          <tbody>
            <tr v-for="(line, index) in invoice.invoiceLines" :key="line.id">
              <th class="text-center">{{ index + 1 }}</th>
              <td class="text-left">{{ line.label }}</td>
              <td class="text-right">{{ line.quantity.toLocaleString('hu-HU') }} {{ line.uomId.name }}</td>
              <td class="text-right">{{ line.unitPrice.toLocaleString('hu-HU') }}</td>
              <td class="text-right">{{ line.netAmount.toLocaleString('hu-HU') }}</td>
              <td class="text-right">
                <span v-for="tax in line.taxesIds" :key="tax.id">{{ tax.label }}</span>
              </td>
              <td class="text-right">{{ line.taxAmount.toLocaleString('hu-HU') }}</td>
              <td class="text-right">{{ line.total.toLocaleString('hu-HU') }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>
      <div class="row q-gutter-xs">
        <div class="col q-pa-sm">
          Invoice Notes
        </div>
        <q-card class="col q-pa-sm" bordered>
          <q-markup-table flat separator="none">
            <tr>
              <th class="text-right">Rounding</th>
              <td class="text-right">{{ invoice.rounding }} <span>{{ invoice.currencyId.symbol }}</span></td>
            </tr>
            <tr>
              <th class="text-right">Exchange Rate</th>
              <td class="text-right">{{ invoice.exchangeRate }} <span>{{ invoice.currencyId.symbol }}</span></td>
            </tr>
            <tr>
              <th class="text-right">Net Amount</th>
              <td class="text-right">{{ invoice.netAmount.toLocaleString('hu-HU') }} <span>{{ invoice.currencyId.symbol }}</span></td>
            </tr>
            <tr>
              <th class="text-right">VAT Amount - 27%</th>
              <td class="text-right">{{ invoice.vatAmount.toLocaleString('hu-HU') }} <span>{{ invoice.currencyId.symbol }}</span></td>
            </tr>
            <tr>
              <th class="text-right">Total Amount</th>
              <td class="text-right">{{ invoice.totalAmount.toLocaleString('hu-HU') }} <span>{{ invoice.currencyId.symbol }}</span></td>
            </tr>
          </q-markup-table>
        </q-card>
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
              <q-editor v-model="editor" min-height="5rem" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Add message" v-close-popup @click="addMessage"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-card class="q-mb-sm" bordered v-for="message in messages" :key="message.id">
          <q-card-section horizontal>
            <q-card-section class="fit">
              <p class="q-mb-none">{{ message.uploaded }} <span>by {{ message.uploader }}</span></p>
              <q-card-section v-html="message.content"></q-card-section>
            </q-card-section>
            <q-card-actions vertical class="justify-around q-px-md">
              <q-btn flat round color="red" icon="favorite" />
              <q-btn flat round color="accent" icon="bookmark" />
              <q-btn flat round color="primary" icon="share" />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { getInvoiceById } from "../../store/invoice";
import { getPartnersByType } from "../../store/partner";
import { v4 as uuid } from "uuid";

const messages = [
  {
    id: 1,
    uploader: "Jonh Smith",
    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate vero perferendis saepe eaque repudiandae impedit itaque asperiores reiciendis, dolores officiis, repellendus illum laudantium rerum magni? Adipisci repellendus corporis, earum incidunt officia accusantium ea facere at dolore et itaque sed ad tempore voluptates perspiciatis sunt, voluptatum molestias quasi quod?",
    uploaded: "2020.01.23"
  },
  {
    id: 2,
    uploader: "Jane Smith",
    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. ",
    uploaded: "2020.01.22"
  },
]

const route = useRoute();
const invoiceId = computed(() => route.params.id);
const invoice = getInvoiceById(invoiceId.value);
const editor = ref("");
const partner = ref(null);
const partnerBank = ref(null);
const newMessage = ref(false);

const addMessage = () => {
  let newMsg = {
    id: uuid(),
    content: editor.value,
    uploader: "Lacika",
    uploaded: new Date().toLocaleString()
  }
  messages.unshift(newMsg);
  editor.value = "";
}

const onItemClick = () => {
  alert("Clicked!");
}

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      customerPartners.value = getPartnersByType("customer");
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    customerPartners.value = getPartnersByType("customer").filter(
      (p) => p.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<style></style>
