import data from "./data.json";
import { getUomById } from "./uom";
import { getTaxById } from "./taxes";
import { getProductById } from "./product";
import { getPartnerById } from "./partner";
import { getLangById } from "./language";
import { getCurrencyById } from "./currency";
import { getBankAccountById } from "./bank";

export function getInvoices() {
  return data.invoices.map(inv => getInvoiceById(inv.id));
}

export function getInvoiceById(id) {
  const invoice = data.invoices.find(inv => inv.id === id);
  return {
    ...invoice,
    partnerId: getPartnerById(invoice.partnerId),
    currencyId: getCurrencyById(invoice.currencyId),
    invoiceLangId: getLangById(invoice.invoiceLangId),
    invoiceLines: getInvoiceLinesByInvoice(invoice.id),
    invoiceBankId: getBankAccountById(invoice.invoiceBankId)
  }
}

export function createDraftInvoice(draft) {
  const inv = JSON.parse(draft);
  const newInvoice = {
    id: inv.id,
    name: inv.name,
    number: inv.number,
    partnerId: inv.partnerId.id,
    invoiceDate: inv.invoiceDate,
    deliveryDate: inv.deliveryDate,
    dueDate: inv.dueDate,
    paymentTherm: inv.paymentTherm,
    paymentMode: inv.paymentMode,
    invoiceBankId: inv.invoiceBankId.id,
    currencyId: inv.currencyId.id,
    exchangeRate: inv.exchangeRate,
    invoiceLangId: inv.invoiceLangId.id,
    netAmount: inv.netAmount,
    vatAmount: inv.vatAmount,
    totalAmount: inv.totalAmount,
    toBePaid: inv.toBePaid,
    rounding: inv.rounding,
    notes: inv.notes,
    state: inv.state,
    messages: inv.messages,
    invoiceLines: inv.invoiceLines.length > 0
      ? inv.invoiceLines.map(l => l.id)
      : []
  }
  console.log('newInvoice', newInvoice)
  if (inv.invoiceLines.length > 0) {
    inv.invoiceLines.forEach(line => {
      const newLine = {
        id: line.id,
        invoiceId: line.invoiceId,
        label: line.label,
        quantity: line.quantity,
        uomId: line.uomId.id,
        unitPrice: line.unitPrice,
        taxesIds: line.taxesIds.length > 0
          ? line.taxesIds.map(t => t.id)
          : [],
        taxAmount: line.taxAmount,
        netAmount: line.netAmount,
        total: line.total,
        productId: line.productId.id
      }
      createInvoiceLine(newLine);
    });
  }

  data.invoices.push(JSON.stringify(newInvoice));
}

function getNextNumber() {
  const invoices = getInvoices();
  const numbers = invoices.map(inv => parseInt(inv.number.slice(-4)));
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
export function getInvoiceLines() {
  return data.invoicelines.map(l => getInvoiceLineById(l.id));
}

export function getInvoiceLinesByInvoice(invoiceId) {
  const found = data.invoicelines.filter(line => line.invoiceId === invoiceId);
  return found.map(f => getInvoiceLineById(f.id));
}

export function getInvoiceLineById(id) {
  const found = data.invoicelines.find(line => line.id === id);
  return {
    ...found,
    uomId: getUomById(found.uomId),
    taxesIds: found.taxesIds.map(id => getTaxById(id)),
    productId:  getProductById(found.productId)
  }
}

export function createInvoiceLine(line) {
  console.log('line', line)
  data.invoicelines.push(JSON.stringify(line));
}