<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 75vw">
      <q-card-section>
        <div class="text-h6">{{ props.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row" style="max-height: 60vh; overflow-y: auto">
        <div class="col-8">
          <div class="row items-center">
            <div class="col-3">Product</div>
            <div class="col-9">
              <q-select
                dense
                clearable
                :options="products"
                v-model="state.productId"
                @update:model-value="onProductChange"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-3">Description</div>
            <div class="col-9">
              <q-input dense clearable autogrow v-model="state.label" />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-3">Quantity</div>
            <div class="col-9">
              <div class="row items-center">
                <div class="col">
                  <q-input
                    dense
                    clearable
                    type="number"
                    v-model.number="state.quantity"
                    @update:model-value="calculate"
                  />
                </div>
                <div class="col">
                  <q-input
                    class="q-pl-md"
                    dense
                    clearable
                    label="Unit of Measure"
                    v-model="state.uomId"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-center">
            <div class="col-3">Unit Price</div>
            <div class="col-9">
              <q-input
                type="number"
                dense
                clearable
                v-model="state.unitPrice"
                @update:model-value="calculate"
              />
            </div>
          </div>
          <div class="row items-center">
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
          v-if="!edit"
          flat
          label="Add"
          icon="add_circle"
          color="primary"
          @click="addNewLine"
        />
        <q-btn
          v-if="edit"
          flat
          label="Save"
          icon="save"
          color="primary"
          @click="modifyLine"
        />
        <q-btn
          v-if="edit"
          flat
          label="Delete"
          color="red"
          icon="delete"
          @click="deleteLine"
        />
        <q-btn
          flat
          label="Cancel"
          icon="cancel"
          color="secondary"
          @click="showDialog = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getProducts } from "src/store/product";
import { getTaxes } from "src/store/taxes";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  line: {
    type: Object,
  },
  edit: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits([
  "update:show",
  "onAddNewLine",
  "onModifyLine",
  "onDeleteLine",
]);

const showDialog = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit("update:show", val);
  },
});
const edit = computed({
  get() {
    return props.edit;
  },
});

const state = computed({
  get() {
    return props.line;
  },
});

const products = ref(null);
const taxes = ref(null);

onMounted(() => {
  products.value = getProducts();
  taxes.value = getTaxes();
});

const onProductChange = () => {
  if (state.value.productId !== null) {
    state.value.label = `[${state.value.productId.internalref}] ${state.value.productId.label}`;
    state.value.uomId = state.value.productId.uomId.name;
    state.value.unitPrice = state.value.productId.unitprice;
    state.value.taxesIds = state.value.productId.saletaxes;
  }
};

const calculate = () => {
  state.value.netAmount = state.value.quantity * state.value.unitPrice;

  let total = state.value.netAmount;
  if (state.value.taxesIds !== null) {
    state.value.taxesIds.forEach((tax) => {
      const current = state.value.netAmount * tax.amount;
      total = total + current;
    });
  }
  state.value.total = total;

  state.value.taxAmount = total - state.value.netAmount;
};

const addNewLine = () => {
  emit("onAddNewLine", JSON.stringify(state.value));
  showDialog.value = false;
};

const modifyLine = () => {
  emit("onModifyLine", JSON.stringify(state.value));
  // edit.value = false;
  showDialog.value = false;
};

const deleteLine = () => {
  emit("onDeleteLine", state.value.id);
  showDialog.value = false;
};
</script>
