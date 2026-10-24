export const userIdStorageKey = 'userid';
export const fullNameStorageKey = 'fullname';
export const roleIdStorageKey = 'role_id';

export const allowedViews = new Set([
  'dashboard',
  'penjualan',
  'pengeluaran',
  'report-sales-outlet',
  'report-sales-combined',
  'report-general',
  'master-staff',
  'master-outlet',
  'master-category',
  'master-menu',
]);

export function readStoredView() {
  try {
    const storedView = window.localStorage.getItem('navia.activeView');
    if (storedView === 'report') {
      return 'report-general';
    }

    return allowedViews.has(storedView) ? storedView : 'dashboard';
  } catch {
    return 'dashboard';
  }
}

export function readStoredUserId() {
  return readStoredText(userIdStorageKey);
}

export function readStoredText(key) {
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked; callers still update React state.
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage can be blocked; callers still update React state.
  }
}
