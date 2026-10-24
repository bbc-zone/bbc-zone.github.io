import { dataTableLanguage } from '../../lib/datatablesLanguage';

export const expenseCategories = [
  'Gaji Karyawan',
  'Listrik',
  'Inventaris',
  'Sewa',
  'Akomodasi',
  'Ongkos',
  'Bahan Baku',
  'Operasional',
  'Lainnya',
];

export const paymentMethods = [
  'Cash',
  'Transfer',
  'QRIS',
  'Kartu',
  'Lainnya',
];

export const emptyExpenseForm = {
  expense_id: '',
  expense_date: new Date().toISOString().slice(0, 10),
  outlet_id: '',
  outlet_name: '',
  category: expenseCategories[0],
  description: '',
  amount: '0',
  payment_method: paymentMethods[0],
  notes: '',
};

export const normalizeExpense = (row) => ({
  expense_id: String(row.expense_id ?? row.id ?? ''),
  expense_date: row.expense_date ?? '',
  outlet_id: String(row.outlet_id ?? ''),
  outlet_name: row.outlet_name ?? '',
  category: row.category ?? expenseCategories[0],
  description: row.description ?? '',
  amount: String(row.amount ?? '0'),
  payment_method: row.payment_method ?? paymentMethods[0],
  notes: row.notes ?? '',
});

export const expenseTableOptions = {
  responsive: true,
  serverSide: true,
  processing: true,
  pageLength: 8,
  lengthChange: false,
  ordering: true,
  order: [[0, 'desc']],
  language: dataTableLanguage('Cari pengeluaran'),
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
