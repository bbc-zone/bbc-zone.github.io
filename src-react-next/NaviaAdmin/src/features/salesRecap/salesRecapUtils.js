import { dataTableLanguage } from '../../lib/datatablesLanguage';

export const officeRecapNotes = 'rekap dari kantor';

export const emptySalesRecapForm = {
  recap_id: '',
  sales_date: new Date().toISOString().slice(0, 10),
  outlet_id: '',
  outlet_name: '',
  category_id: '',
  category_name: '',
  total_sales: '0',
  total_transactions: '0',
  cash_amount: '0',
  qris_amount: '0',
  delivery_amount: '0',
  other_amount: '0',
  notes: officeRecapNotes,
};

export const normalizeSalesRecap = (row) => ({
  recap_id: String(row.recap_id ?? row.id ?? ''),
  sales_date: row.sales_date ?? '',
  outlet_id: String(row.outlet_id ?? ''),
  outlet_name: row.outlet_name ?? '',
  category_id: String(row.category_id ?? ''),
  category_name: row.category_name ?? '',
  total_sales: String(row.total_sales ?? '0'),
  total_transactions: String(row.total_transactions ?? '0'),
  cash_amount: String(row.cash_amount ?? '0'),
  qris_amount: String(row.qris_amount ?? '0'),
  delivery_amount: String(row.delivery_amount ?? '0'),
  other_amount: String(row.other_amount ?? '0'),
  notes: row.notes ?? officeRecapNotes,
});

export const salesPaymentTotal = (recap) => (
  Number(recap.cash_amount || 0) +
  Number(recap.qris_amount || 0) +
  Number(recap.delivery_amount || 0)
);

export const salesRecapTableOptions = {
  responsive: true,
  serverSide: true,
  processing: true,
  pageLength: 8,
  lengthChange: false,
  ordering: true,
  order: [[0, 'desc']],
  language: dataTableLanguage('Cari rekap'),
};

export const formatCurrency = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
};
