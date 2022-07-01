<template>
  <q-page padding>
    <div class="q-pa-sm q-mb-sm">
      <div class="row items-center q-gutter-sm">
        <div class="col">
          <q-btn color="primary" label="Add" icon="add" @click="addTax" />
        </div>
        <div class="col-3">
          <q-select
            label="Order By"
            :options="orderByOptions"
            v-model="selectedOrder"
          />
        </div>
        <div class="col-3">
          <q-input v-model="filter" label="Filter" clearable />
        </div>
      </div>
    </div>
    <div class="q-pa-sm">
      <q-card v-for="tax in taxes" :key="tax.id" flat bordered class="q-mb-sm">
        <q-expansion-item
          expand-separator
          :label="tax.label"
          :caption="tax.type"
          group="taxes"
        >
          <q-card>
            <q-card-section vertical class="q-pa-sm">
              <div class="row items-center q-px-sm">
                <div class="col-4">
                  <tax-field
                    name="Name"
                    :taxValue="tax.name"
                    @update:taxValue="
                      (newValue) => {
                        tax.name = newValue;
                        taxChanged(tax.id);
                      }
                    "
                    :type="'text'"
                  ></tax-field>
                </div>
                <div class="col-4">
                  <tax-field
                    name="Label"
                    :tax-value="tax.label"
                    @update:tax-value="
                      (newValue) => {
                        tax.label = newValue;
                        taxChanged(tax.id);
                      }
                    "
                    :type="'text'"
                  ></tax-field>
                </div>
                <div class="col-4">
                  <q-checkbox
                    v-model="tax.active"
                    label="Active"
                    @update:model-value="taxChanged(tax.id)"
                  />
                </div>
                <div class="col-4">
                  <tax-field
                    name="Category"
                    :tax-value="tax.category"
                    @update:tax-value="
                      (newValue) => {
                        tax.category = newValue;
                        taxChanged(tax.id);
                      }
                    "
                    :type="'text'"
                  ></tax-field>
                </div>
                <div class="col-4">
                  <tax-field
                    name="Scope"
                    :tax-value="tax.scope"
                    @update:tax-value="
                      (newValue) => {
                        tax.scope = newValue;
                        taxChanged(tax.id);
                      }
                    "
                    :type="'select'"
                    :options="scopeTypes"
                  ></tax-field>
                </div>
                <div class="col-4">
                  <tax-field
                    name="Type"
                    :tax-value="tax.type"
                    @update:tax-value="
                      (newValue) => {
                        tax.type = newValue;
                        taxChanged(tax.id);
                      }
                    "
                    :type="'select'"
                    :options="taxTypes"
                  ></tax-field>
                </div>
                <div class="col-4">
                  <tax-field
                    name="Computation"
                    :tax-value="tax.computation"
                    @update:tax-value="
                      (newValue) => {
                        tax.computation = newValue;
                        taxChanged(tax.id);
                      }
                    "
                    :type="'select'"
                    :options="computationTypes"
                  ></tax-field>
                </div>
                <div class="col-4">
                  <tax-field
                    name="Amount"
                    :tax-value="tax.amount"
                    @update:tax-value="
                      (newValue) => {
                        tax.amount = newValue;
                        taxChanged(tax.id);
                      }
                    "
                    :type="'number'"
                  ></tax-field>
                </div>
                <div class="col-4">
                  <q-checkbox
                    v-model="tax.included"
                    label="Included"
                    @update:model-value="taxChanged(tax.id)"
                  />
                </div>
              </div>
              <q-card-actions horizontal class="justify-center q-pa-none">
                <q-btn
                  flat
                  color="red"
                  icon="delete"
                  label="Remove"
                  @click="removeTax(tax.id)"
                />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTaxes, deleteTaxById, updateTax, createTax } from "src/store/taxes";
import { v4 as uuid } from "uuid";
import TaxField from "src/components/TaxField.vue";

const loading = ref(false);
const taxes = ref([]);
const filter = ref("");

const orderByOptions = [
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Label",
    value: "label",
  },
  {
    label: "Category",
    value: "category",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Type",
    value: "type",
  },
  {
    label: "Scope",
    value: "scope",
  },
];
const selectedOrder = "Name";

const computationTypes = ["fixed", "percentage"];
const taxTypes = ["purchase", "sale"];
const scopeTypes = ["item", "service", "other"];

onMounted(async () => {
  await loadTaxes();
});

const loadTaxes = async () => {
  loading.value = true;
  taxes.value = await getTaxes();
  loading.value = false;
};

const taxChanged = async (id) => {
  const found = taxes.value.find((t) => t.id === id);
  if (!found) return;
  const result = await updateTax(found);
  if (result.status === 200) {
    loadTaxes();
  } else {
    alert("Could not update tax.");
    console.log("Could not update tax: ", result);
  }
};

const removeTax = async (id) => {
  const found = taxes.value.find((t) => t.id === id);
  if (!found) return;
  const response = await deleteTaxById(id);
  if (response.status === 200) {
    loadTaxes();
  } else {
    alert("Cannot delete tax.");
    console.log("Cannot delete tax. ", response);
  }
};

const addTax = async () => {
  const newTax = {
    id: uuid(),
    name: "",
    category: "",
    active: true,
    type: "sale",
    scope: "item",
    computation: "percentage",
    amount: 0,
    label: "",
    included: false,
  };
  const response = await createTax(newTax);
  if (response.status === 201) {
    loadTaxes();
  } else {
    alert("Cannot create new tax.");
    console.log("Cannot create new tax. ", response);
  }
};
</script>

<style lang="sass">
.taxes-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
