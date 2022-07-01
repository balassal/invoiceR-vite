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
      <template v-if="product">
        <div class="row q-pa-sm q-gutter-sm items-center justify-between">
          <div class="col-xs-12 col-sm-6 col-md-10">
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-sm">
              <span class="text-caption q-ma-none q-mr-sm">Name:</span>
              <span v-if="!editMode" class="text-h6">{{ product.name }}</span>
              <q-input
                ref="nameField"
                v-else
                class="fit"
                dense
                color="primary"
                v-model="product.name"
                hint="Name is required"
                :rules="[(val) => !!val || 'Name is required!']"
                lazy-rules="ondemand"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm col-md">
            <q-checkbox
              class="q-ma-none"
              v-model="product.active"
              label="Active"
              :disable="!editMode"
            />
          </div>
        </div>
        <div class="row q-pa-sm q-gutter-sm justify-between">
          <div class="col-xs-12 col-sm-6">
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-sm">Label:</span>
              <span v-if="!editMode" class="text-h6">{{ product.label }}</span>
              <q-input
                v-else
                ref="labelField"
                class="fit"
                dense
                color="primary"
                v-model="product.label"
                hint="Label is required"
                :rules="[(val) => !!val || 'Label is required!']"
                lazy-rules="ondemand"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-sm">Type:</span>
              <span v-if="!editMode" class="text-h6">{{ product.type }}</span>
              <q-select
                v-else
                class="fit"
                dense
                color="primary"
                v-model="product.type"
                :options="productTypes"
                :rules="[(val) => !!val || 'Please select a type']"
                lazy-rules="ondemand"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-sm">Internal Reference:</span>
              <span v-if="!editMode" class="text-h6">{{
                product.internalref
              }}</span>
              <q-input
                v-else
                class="fit"
                dense
                color="primary"
                v-model="product.internalref"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm">
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-sm">Unit Price:</span>
              <span v-if="!editMode" class="text-h6">{{
                product.unitprice
              }}</span>
              <q-input
                v-else
                class="fit"
                dense
                color="primary"
                v-model.number="product.unitprice"
                type="number"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-sm">Unit of Measure:</span>
              <span v-if="!editMode" class="text-h6">{{
                product.uomId.name
              }}</span>
              <q-select
                v-else
                ref="uomSelect"
                class="fit"
                dense
                option-value="id"
                option-label="name"
                color="primary"
                v-model="product.uomId"
                hint="UoM is required"
                :options="uoms"
                :rules="[(val) => !!val || 'Please select a unit of measure']"
                lazy-rules="ondemand"
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-sm">Sale Taxes:</span>
              <span v-if="!editMode" class="text-h6">
                <q-badge
                  v-for="tax in product.saletaxes"
                  outline
                  :key="tax.id"
                  color="primary"
                  :label="tax.name"
                  class="q-mx-xs"
                />
              </span>
              <q-select
                v-else
                v-model="product.saletaxes"
                multiple
                class="fit"
                :options="saleTaxOptions"
                option-value="id"
                option-label="label"
                use-chips
              />
            </div>
            <div class="row no-wrap q-gutter-sm items-baseline q-ma-none">
              <span class="text-caption q-mr-sm">Purchase Taxes:</span>
              <span v-if="!editMode" class="text-h6">
                <q-badge
                  v-for="tax in product.purchasetaxes"
                  outline
                  :key="tax.id"
                  color="secondary"
                  :label="tax.name"
                  class="q-mx-xs"
                />
              </span>
              <q-select
                v-else
                v-model="product.purchasetaxes"
                multiple
                class="fit"
                :options="purchaseTaxOptions"
                option-value="id"
                option-label="label"
                use-chips
              />
            </div>
          </div>
        </div>
        <div v-if="!editMode && product.note" class="row q-pa-sm q-ma-sm">
          <span class="text-caption q-mr-sm">Note:</span>
          <span>{{ product.note }}</span>
        </div>
        <div v-if="editMode" class="row q-pa-sm q-ma-sm">
          <span class="text-caption q-mr-sm">Note:</span>
          <q-input
            class="fit"
            dense
            filled
            autogrow
            color="primary"
            v-model="product.note"
          />
        </div>
      </template>
    </div>
    <pre>{{ product }}</pre>
  </q-page>
</template>

<script setup>
import {
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} from "src/store/product";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Spinner from "src/components/Spinner.vue";
import { getUoms } from "src/store/uom";
import { getTaxesByType } from "src/store/taxes";
import { useQuasar } from "quasar";
import { v4 as uuid } from "uuid";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const product = ref(null);
const editMode = ref(false);
const canDelete = ref(false);
const canCreate = ref(false);
const nameField = ref(null);
const labelField = ref(null);
const uomSelect = ref(null);

const productTypes = ref(["product", "service", "other"]);

const uoms = ref([]);
const saleTaxOptions = ref([]);
const purchaseTaxOptions = ref([]);

onMounted(async () => {
  if (route.params.id) {
    await loadProduct(route.params.id);
  } else {
    await loadNewProduct();
  }

  uoms.value = await getUoms();
  saleTaxOptions.value = await getTaxesByType("sale");
  purchaseTaxOptions.value = await getTaxesByType("purchase");
});

const loadProduct = async (id) => {
  loading.value = true;
  product.value = await getProductById(id);
  loading.value = false;
  editMode.value = false;
  canDelete.value = true;
};

const loadNewProduct = async () => {
  product.value = {
    id: uuid(),
    name: "",
    label: "",
    active: true,
    type: "product",
    internalref: "",
    unitprice: 0,
    saletaxes: [],
    purchasetaxes: [],
    uomId: "",
    note: "",
  };
  editMode.value = true;
  canCreate.value = true;
};

const onSave = async () => {
  const response = await updateProduct(product.value);
  if (response.status === 200) {
    loadProduct(response.data.id);
    editMode.value = false;
  } else {
    alert("Cannot update product!");
    console.log("Cannot update product. ", response);
    editMode.value = true;
  }
};

const onDelete = async () => {
  $q.dialog({
    title: "Confirm",
    message: "Would you like to delete product?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const response = await deleteProduct(product.value.id);
    if (response.status === 200) {
      router.push({ name: "productList" });
    } else {
      alert("Cannot delete product!");
      console.log("Cannot delete product. ", response);
    }
  });
};

const hasError = () => {
  let anyError = false;
  if (!nameField.value.validate()) anyError = true;
  if (!labelField.value.validate()) anyError = true;
  if (!uomSelect.value.validate()) anyError = true;

  return anyError;
};

const onCreate = async () => {
  if (!hasError()) {
    const response = await createProduct(product.value);
    if (response.status === 200 || response.status === 201) {
      router.push({ name: "productList" });
    } else {
      alert("Cannot create product!");
      console.log("Cannot create product. ", response);
    }
  }
};
</script>
