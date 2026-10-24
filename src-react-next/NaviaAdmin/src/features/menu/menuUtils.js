import { dataTableLanguage } from '../../lib/datatablesLanguage';

export const emptyMenuForm = {
  menu_id: '',
  menu_name: '',
  harga: '0',
  category_id: '',
  category_name: '',
  outlet_names: '',
  description: '',
};

export const normalizeMenu = (row) => ({
  menu_id: String(row.menu_id ?? row.id ?? ''),
  menu_name: row.menu_name ?? row.name ?? '',
  harga: String(row.harga ?? '0'),
  category_id: String(row.category_id ?? ''),
  category_name: row.category_name ?? '',
  outlet_names: row.outlet_names ?? '',
  description: row.description ?? '',
});

export const menuTableOptions = {
  responsive: true,
  serverSide: true,
  processing: true,
  pageLength: 8,
  lengthChange: false,
  ordering: true,
  language: dataTableLanguage('Cari menu'),
};
