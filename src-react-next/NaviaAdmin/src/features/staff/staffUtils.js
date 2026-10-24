import { dataTableLanguage } from '../../lib/datatablesLanguage';

export const emptyStaffForm = {
  id: '',
  username: '',
  fullname: '',
  email: '',
  phone: '',
  role: '',
  role_id: '',
  password: '',
  isActive: true,
};

export const normalizeStaff = (row) => ({
  id: String(row.id ?? Date.now()),
  username: row.username ?? row.name ?? '',
  fullname: row.fullname ?? row.name ?? '',
  email: row.email ?? '',
  phone: row.phone ?? '',
  role: String(row.role_name ?? row.role ?? row.role_id ?? ''),
  role_id: String(row.role_id ?? row.roleId ?? row.role ?? ''),
  password: '',
  isActive: row.isActive === true || row.isActive === 1 || row.isActive === '1' || row.status === 'Active',
});

export const visibleUsers = (rows) => rows.map(normalizeStaff).filter((row) => String(row.role_id || row.role) !== '1');

export const userTableOptions = {
  responsive: true,
  serverSide: true,
  processing: true,
  pageLength: 8,
  lengthChange: false,
  ordering: true,
  language: dataTableLanguage('Cari staff'),
};
