<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card style="width: 75vw; max-width: 75vw">
      <q-card-section>
        <div class="text-h6">{{ props.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row">
        <div class="col-8">
          <div class="row items-center">
            <div class="col-3">Product</div>
            <div class="col-9">
              <q-select
                ref="productField"
                dense
                clearable
                :options="products"
                v-model="state.productId"
                @update:model-value="onProductChange"
                autofocus
                :rules="[(val) => !!val || 'Product is required']"
                lazy-rules="ondemand"
                hint="Select a product"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-3">Description</div>
            <div class="col-9">
              <q-input dense clearable autogrow v-model="state.label" />
            </div>
          </div>
          <div class="row items-center q-py-sm">
            <div class="col-3">Quantity</div>
            <div class="col-9">
              <div class="row items-center">
                <div class="col">
                  <q-input
                    ref="quantityField"
                    dense
                    clearable
                    class="q-pb-none"
                    type="number"
                    v-model.number="state.quantity"
                    @update:model-value="calculate"
                    :rules="[
                      (val) => !!val || 'Quantity is required',
                      (val) => val != 0 || 'Cannot be zero',
                    ]"
                    lazy-rules="ondemand"
                  />
                </div>
                <div class="col">
                  <q-input
                    class="q-pl-md"
                    dense
                    readonly
                    label="Unit of Measure"
                    v-model="state.uomId"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-center q-py-sm">
            <div class="col-3">Unit Price</div>
            <div class="col-9">
              <q-input
                ref="unitPriceField"
                type="number"
                dense
                clearable
                v-model.number="state.unitPrice"
                @update:model-value="calculate"
                :rules="[(val) => !!val || 'Unit Price is required']"
                lazy-rules="ondemand"
              />
            </div>
          </div>
          <div class="row items-center q-py-sm">
            <div class="col-3">Taxes</div>
            <div class="col-9">
              <q-select
                dense
                clearable
                use-chips
                multiple
                :options="taxes"
                v-model="state.taxesIds"
                @update:model-value="calculate"
              />
            </div>
          </div>
        </div>
        <div class="col">
          <table class="full-width">
            <tbody>
              <tr>
                <th class="text-right">Net Amount</th>
                <td class="text-right">
                  {{ state.netAmount.toLocaleString("hu-Hu") }}
                </td>
              </tr>
              <tr v-for="tax in state.taxesIds" :key="tax.id">
                <th class="text-right">{{ tax.label }}</th>
                <td class="text-right">
                  {{ (state.netAmount * tax.amount).toLocaleString("hu-HU") }}
                </td>
              </tr>
              <tr>
                <th class="text-right">Total</th>
                <td class="text-right">
                  {{ state.total.toLocaleString("hu-HU") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          color="secondary"
          icon="close"
          label="Cancel"
          @click="onDialogCancel"
        />
        <q-btn
          v-if="props.mode === 'add'"
          flat
          label="Add"
          icon="add_circle"
          color="primary"
          @click="addNewLine"
        />
        <q-btn
          v-if="props.mode === 'edit'"
          flat
          label="Save"
          icon="save"
          color="orange"
          @click="modifyLine"
        />
        <q-btn
          v-if="props.mode === 'edit'"
          flat
          label="Delete"
          color="red"
          icon="delete"
          @click="deleteLine"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useDialogPluginComponent } from "quasar";
import { getProducts } from "src/store/product";
import { getTaxes } from "src/store/taxes";
import { v4 as uuid } from "uuid";

const productField = ref(null);
const quantityField = ref(null);
const unitPriceField = ref(null);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  line: {
    type: Object,
  },
  mode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const state = reactive({
  id: "",
  productId: "",
  netAmount: 0,
  label: "",
  quantity: 0,
  uomId: "",
  unitPrice: 0,
  taxesIds: [],
  total: 0,
});

const products = ref(null);
const taxes = ref(null);

onMounted(async () => {
  products.value = await getProducts();
  taxes.value = await getSaleTaxes();

  if (props.line) {
    state.id = props.line.id;
    state.productId = props.line.productId;
    state.netAmount = props.line.netAmount;
    state.label = props.line.label;
    state.quantity = props.line.quantity;
    state.uomId = props.line.uomId;
    state.unitPrice = props.line.unitPrice;
    state.taxesIds = props.line.taxesIds;
    state.total = props.line.total;
  }
});

const getSaleTaxes = async () => {
  const taxes = await getTaxes();
  const saleTaxes = taxes.filter((tax) => tax["type"] === "sale");
  return saleTaxes;
};

const onProductChange = () => {
  if (state.productId !== null) {
    state.label = `[${state.productId.internalref}] ${state.productId.label}`;
    state.uomId = state.productId.uomId.name;
    state.unitPrice = state.productId.unitprice;
    state.taxesIds = state.productId.saletaxes;
  }
};

const calculate = () => {
  state.netAmount = state.quantity * state.unitPrice;

  let total = state.netAmount;
  if (state.taxesIds !== null) {
    state.taxesIds.forEach((tax) => {
      const current = state.netAmount * tax.amount;
      total = total + current;
    });
  }
  state.total = total;

  state.taxAmount = total - state.netAmount;
};

const isValid = () => {
  return (
    productField.value.validate() &&
    quantityField.value.validate() &&
    unitPriceField.value.validate()
  );
};

const addNewLine = () => {
  if (isValid()) {
    const newLine = {
      id: uuid(),
      label: state.label,
      quantity: state.quantity,
      uomId: state.uomId,
      unitPrice: state.unitPrice,
      taxesIds: JSON.parse(JSON.stringify(state.taxesIds)),
      taxAmount: state.taxAmount,
      netAmount: state.netAmount,
      total: state.total,
      productId: JSON.parse(JSON.stringify(state.productId)),
    };
    onDialogOK({
      line: newLine,
    });
  }
};

const modifyLine = () => {
  if (isValid()) {
    const modifLine = {
      id: state.id,
      label: state.label,
      quantity: state.quantity,
      uomId: state.uomId,
      unitPrice: state.unitPrice,
      taxesIds: JSON.parse(JSON.stringify(state.taxesIds)),
      taxAmount: state.taxAmount,
      netAmount: state.netAmount,
      total: state.total,
      productId: JSON.parse(JSON.stringify(state.productId)),
    };
    onDialogOK({
      line: modifLine,
      type: "update",
    });
  }
};

const deleteLine = () => {
  onDialogOK({
    id: state.id,
    type: "delete",
  });
};
</script>
