import { dataTableLanguage } from '../../lib/datatablesLanguage';

export const emptyOutletForm = {
  outlet_id: '',
  outlet_name: '',
  category_id: '',
  category_name: '',
  outlet_address: '',
};

export const normalizeOutlet = (row) => ({
  outlet_id: String(row.outlet_id ?? row.id ?? ''),
  outlet_name: row.outlet_name ?? row.name ?? '',
  category_id: String(row.category_id ?? ''),
  category_name: row.category_name ?? '',
  outlet_address: row.outlet_address ?? row.address ?? '',
});

export const outletTableOptions = {
  responsive: true,
  serverSide: true,
  processing: true,
  pageLength: 8,
  lengthChange: false,
  ordering: true,
  language: dataTableLanguage('Cari outlet'),
};
