<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
     <q-btn color="white" text-color="black" label="Log" @click="onLog" />
  </q-page>
</template>

<script setup>
import { getAddresses } from 'src/store/address';
import { getBankAccountById, getBankAccounts } from 'src/store/bank';
import { getCurrencies, getCurrencyById } from 'src/store/currency';
import { getInvoices, getInvoiceLines, getInvoiceLinesByInvoice, getInvoiceLineById } from 'src/store/invoice';
import { getLanguages } from 'src/store/language';
import { getPartners } from 'src/store/partner';
import { getProducts } from 'src/store/product';
import { getTaxes } from 'src/store/taxes';
import { getUoms } from 'src/store/uom';

const onLog = () => {
  console.log("Getting invoices...")
  console.log(getInvoices());
}
</script>