import axios from "axios";
import { getUomById } from "./uom";
import { getTaxById } from "./taxes";
import { getProductById } from "./product";
import { getPartnerById } from "./partner";
import { getLangById } from "./language";
import { getCurrencyById } from "./currency";
import { getBankAccountById } from "./bank";

const apiURL = process.env.API_URL;

export async function getInvoices() {
  let invoices = [];
  await axios.get(`${apiURL}/invoices`).then((res) => {
    invoices = res.data;
  });

  const result = await Promise.all(
    invoices.map(async (inv) => await getInvoiceById(inv.id))
  );

  return result;
}

export async function getInvoiceById(id) {
  let invoice = {};
  await axios.get(`${apiURL}/invoices/${id}`).then((res) => {
    invoice = res.data;
  });

  return {
    ...invoice,
    partnerId: await getPartnerById(invoice.partnerId),
    currencyId: await getCurrencyById(invoice.currencyId),
    invoiceLangId: await getLangById(invoice.invoiceLangId),
    invoiceLines: await getInvoiceLinesByInvoice(invoice.id),
    invoiceBankId: await getBankAccountById(invoice.invoiceBankId),
  };
}

function getNextNumber() {
  const invoices = getInvoices();
  const numbers = invoices.map((inv) => parseInt(inv.number.slice(-4)));
  let biggest = Math.max(numbers);
  let next = biggest + 1;
  return next;
}

export function getNextInvoiceNumber() {
  let date = new Date();
  let year = date.getFullYear();
  let invoiceDigits = pad(getNextNumber(), 5);
  return `INV-${year}/${invoiceDigits}`;
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

/**************** Invoice Lines *************************/
export async function getInvoiceLines() {
  let lines = [];
  await axios.get(`${apiURL}/invoicelines`).then((res) => (lines = res.data));

  const result = await Promise.all(
    lines.map(async (line) => getInvoiceLineById(line.id))
  );

  return result;
}

export async function getInvoiceLinesByInvoice(invoiceId) {
  let lines = [];
  await axios
    .get(`${apiURL}/invoicelines?invoiceId=${invoiceId}`)
    .then((res) => (lines = res.data));

  const result = await Promise.all(
    lines.map(async (line) => await getInvoiceLineById(line.id))
  );

  return result;
}

export async function getInvoiceLineById(id) {
  let line = {};
  await axios.get(`${apiURL}/invoicelines/${id}`).then((res) => {
    line = res.data;
  });

  return {
    ...line,
    uomId: await getUomById(line.uomId),
    taxesIds: await Promise.all(
      line.taxesIds.map(async (id) => await getTaxById(id))
    ),
    productId: await getProductById(line.productId),
  };
}
