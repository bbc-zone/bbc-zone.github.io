import { dataTableLanguage } from '../../lib/datatablesLanguage';

export const emptyCategoryForm = {
  category_id: '',
  category_name: '',
};

export const normalizeCategory = (row) => ({
  category_id: String(row.category_id ?? row.id ?? ''),
  category_name: row.category_name ?? row.name ?? '',
  outlet_names: row.outlet_names ?? row.outlets ?? '',
});

export const categoryTableOptions = {
  responsive: true,
  serverSide: true,
  processing: true,
  pageLength: 8,
  lengthChange: false,
  ordering: true,
  language: dataTableLanguage('Cari kategori'),
};
