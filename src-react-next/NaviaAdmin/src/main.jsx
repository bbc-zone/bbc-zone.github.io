import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ChefHat,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Tag,
  Users,
  X,
} from 'lucide-react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import './styles.css';
import { AlertModal, ChangePasswordModal, emptyPasswordForm, emptyUserInfoForm, UserInfoModal } from './components/AccountModals';
import { LoginView } from './components/LoginView';
import { UserPanel } from './components/UserPanel';
import { useEnterToSubmitForms } from './hooks/useEnterToSubmitForms';
import { postApi } from './lib/api';
import { fullNameStorageKey, readStoredText, readStoredUserId, readStoredView, removeStorage, roleIdStorageKey, userIdStorageKey, writeStorage } from './lib/storage';
import { CategoryView } from './views/CategoryView';
import { DashboardView } from './views/DashboardView';
import { ExpenseView } from './views/ExpenseView';
import { MenuView } from './views/MenuView';
import { OutletView } from './views/OutletView';
import { ReportView } from './views/ReportView';
import { SalesReportView } from './views/SalesReportView';
import { SalesRecapView } from './views/SalesRecapView';
import { StaffView } from './views/StaffView';

DataTable.use(DT);

function navClass(currentView, view) {
  return `nav-link ${currentView === view ? 'active' : ''}`;
}

function App() {
  const [view, setActiveView] = useState(readStoredView);
  const [staffCreateSignal, setStaffCreateSignal] = useState(0);
  const [outletCreateSignal, setOutletCreateSignal] = useState(0);
  const [categoryCreateSignal, setCategoryCreateSignal] = useState(0);
  const [menuCreateSignal, setMenuCreateSignal] = useState(0);
  const [salesRecapCreateSignal, setSalesRecapCreateSignal] = useState(0);
  const [expenseCreateSignal, setExpenseCreateSignal] = useState(0);
  const [userId, setUserId] = useState(readStoredUserId);
  const [fullname, setFullname] = useState(() => readStoredText(fullNameStorageKey));
  const [roleId, setRoleId] = useState(() => readStoredText(roleIdStorageKey));
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [userInfoForm, setUserInfoForm] = useState(emptyUserInfoForm);
  const [userInfoError, setUserInfoError] = useState('');
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [passwordError, setPasswordError] = useState('');
  const [passwordAlert, setPasswordAlert] = useState('');

  useEnterToSubmitForms();

  useEffect(() => {
    if (!userId) {
      return;
    }

    postApi('../api/profile.php', { action: 'info', userid: userId })
      .then((payload) => {
        if (!payload.ok || !payload.data) {
          return;
        }

        const nextFullname = payload.data.fullname || fullname;
        const nextRoleId = String(payload.data.role_id || '');

        if (nextFullname) {
          setFullname(nextFullname);
          writeStorage(fullNameStorageKey, nextFullname);
        }

        if (nextRoleId) {
          setRoleId(nextRoleId);
          writeStorage(roleIdStorageKey, nextRoleId);
        }
      })
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    const isStoredMasterView = view === 'master-staff' || view === 'master-outlet' || view === 'master-category' || view === 'master-menu';
    const storedRoleId = Number(roleId || 0);

    if (userId && roleId !== '' && isStoredMasterView && !(storedRoleId > 0 && storedRoleId <= 3)) {
      setView('dashboard');
    }
  }, [userId, roleId, view]);

  function setView(nextView) {
    setActiveView(nextView);
    writeStorage('navia.activeView', nextView);
  }

  function handleLogin(user) {
    setUserId(user.userid);
    setFullname(user.fullname);
    setRoleId(user.role_id || '');
  }

  function handleLogout() {
    removeStorage(userIdStorageKey);
    removeStorage(fullNameStorageKey);
    removeStorage(roleIdStorageKey);
    setUserId('');
    setFullname('');
    setRoleId('');
  }

  function updateUserInfoField(field, value) {
    setUserInfoForm((current) => ({ ...current, [field]: value }));
  }

  function updatePasswordField(field, value) {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  }

  function openUserInfo() {
    setUserInfoError('');
    setIsUserInfoOpen(true);

    postApi('../api/profile.php', { action: 'info', userid: userId })
      .then((payload) => {
        if (!payload.ok || !payload.data) {
          setUserInfoError(payload.message || 'Info user gagal dimuat.');
          return;
        }

        setUserInfoForm({
          username: payload.data.username || '',
          fullname: payload.data.fullname || '',
          email: payload.data.email || '',
          phone: payload.data.phone || '',
          role: payload.data.role || '',
        });
      })
      .catch(() => setUserInfoError('Info user gagal dimuat.'));
  }

  function closeUserInfo() {
    setIsUserInfoOpen(false);
    setUserInfoError('');
  }

  function submitUserInfo(event) {
    event.preventDefault();

    postApi('../api/profile.php', {
      action: 'update',
      userid: userId,
      fullname: userInfoForm.fullname,
      email: userInfoForm.email,
      phone: userInfoForm.phone,
    })
      .then((payload) => {
        if (!payload.ok || !payload.data) {
          setUserInfoError(payload.message || 'Info user gagal disimpan.');
          return;
        }

        const nextFullname = payload.data.fullname || userInfoForm.fullname;
        const nextRoleId = String(payload.data.role_id || roleId || '');
        setFullname(nextFullname);
        setRoleId(nextRoleId);
        writeStorage(fullNameStorageKey, nextFullname);
        writeStorage(roleIdStorageKey, nextRoleId);
        closeUserInfo();
      })
      .catch(() => setUserInfoError('Info user gagal disimpan.'));
  }

  function openChangePassword() {
    setPasswordForm(emptyPasswordForm);
    setPasswordError('');
    setPasswordAlert('');
    setIsPasswordOpen(true);
  }

  function closeChangePassword() {
    setIsPasswordOpen(false);
    setPasswordError('');
    setPasswordAlert('');
  }

  function submitChangePassword(event) {
    event.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Password baru dan konfirmasi password belum sama.');
      return;
    }

    postApi('../api/profile.php', {
      action: 'changePassword',
      userid: userId,
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    })
      .then((payload) => {
        if (!payload.ok) {
          setPasswordAlert(payload.message || 'Password lama tidak sesuai.');
          return;
        }

        closeChangePassword();
      })
      .catch(() => setPasswordAlert('Password lama tidak sesuai.'));
  }

  if (!userId) {
    return <LoginView onLogin={handleLogin} />;
  }

  const isMasterView = view === 'master-staff' || view === 'master-outlet' || view === 'master-category' || view === 'master-menu';
  const isTransactionView = view === 'penjualan' || view === 'pengeluaran';
  const isReportView = view === 'report-sales-outlet' || view === 'report-sales-combined' || view === 'report-general';
  const isDashboardView = view === 'dashboard';
  const isDataTableView = isMasterView || isTransactionView;
  const numericRoleId = Number(roleId || 0);
  const canAccessMaster = numericRoleId > 0 && numericRoleId <= 3;

  const pageTitle = view === 'master-staff'
    ? 'Staff'
    : view === 'master-outlet'
      ? 'Outlet'
      : view === 'master-category'
        ? 'Category Menu'
        : view === 'master-menu'
          ? 'Menu'
          : view === 'penjualan'
          ? 'Rekap Penjualan'
          : view === 'pengeluaran'
            ? 'Pengeluaran'
            : view === 'report-sales-outlet'
              ? 'Sales Report Per Outlet'
              : view === 'report-sales-combined'
                ? 'Sales Report Gabungan'
                : view === 'report-general'
                  ? 'General Report'
                  : 'Operasional hari ini';
  const pageEyebrow = isMasterView ? 'Master data' : isTransactionView ? 'Transaksi' : isReportView ? 'Laporan' : 'Dashboard admin';

  return (
    <div className="dashboard-shell d-lg-grid">
      <aside className="sidebar d-flex flex-lg-column align-items-lg-stretch" aria-label="Navigasi utama">
        <div className="brand-mark flex-shrink-0">
          <span>BBC-Zone</span>
        </div>
        <nav className="nav nav-pills navia-nav flex-row flex-lg-column gap-2">
          <button className={navClass(view, 'dashboard')} type="button" title="Dashboard" onClick={() => setView('dashboard')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className={navClass(view, 'penjualan')} type="button" title="Rekap Penjualan" onClick={() => setView('penjualan')}>
            <ShoppingBag size={20} />
            <span>Rekap Penjualan</span>
          </button>
          <button className={navClass(view, 'pengeluaran')} type="button" title="Pengeluaran" onClick={() => setView('pengeluaran')}>
            <CreditCard size={20} />
            <span>Pengeluaran</span>
          </button>
          <div className="nav-section">
            <button className="nav-link master-link" type="button" title="Report" onClick={() => setView('report-general')}>
              <FileBarChart size={20} />
              <span>Report</span>
            </button>
            <div className="nav-submenu">
              <button className={navClass(view, 'report-sales-outlet')} type="button" title="Sales Report Per Outlet" onClick={() => setView('report-sales-outlet')}>
                <FileBarChart size={18} />
                <span>Sales Report Per Outlet</span>
              </button>
              <button className={navClass(view, 'report-sales-combined')} type="button" title="Sales Report Gabungan" onClick={() => setView('report-sales-combined')}>
                <FileBarChart size={18} />
                <span>Sales Report Gabungan</span>
              </button>
              <button className={navClass(view, 'report-general')} type="button" title="General Report" onClick={() => setView('report-general')}>
                <FileBarChart size={18} />
                <span>General Report</span>
              </button>
            </div>
          </div>
          {canAccessMaster ? (
            <div className="nav-section">
              <button className="nav-link master-link" type="button" title="Master">
                <PackageCheck size={20} />
                <span>Master</span>
              </button>
              <div className="nav-submenu">
                <button className={navClass(view, 'master-staff')} type="button" title="Staff" onClick={() => setView('master-staff')}>
                  <Users size={18} />
                  <span>Staff</span>
                </button>
                <button className={navClass(view, 'master-outlet')} type="button" title="Outlet" onClick={() => setView('master-outlet')}>
                  <ShoppingBag size={18} />
                  <span>Outlet</span>
                </button>
                <button className={navClass(view, 'master-category')} type="button" title="Category Menu" onClick={() => setView('master-category')}>
                  <Tag size={18} />
                  <span>Category Menu</span>
                </button>
                <button className={navClass(view, 'master-menu')} type="button" title="Menu" onClick={() => setView('master-menu')}>
                  <ChefHat size={18} />
                  <span>Menu</span>
                </button>
              </div>
            </div>
          ) : null}
        </nav>
        <UserPanel fullname={fullname} onUserInfo={openUserInfo} onChangePassword={openChangePassword} onLogout={handleLogout} />
      </aside>

      <main className="workspace container-fluid">
        {!isDashboardView ? (
          <header className="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 mb-4">
            <div>
              <p className="eyebrow">{pageEyebrow}</p>
              <h1>{pageTitle}</h1>
            </div>
            <div className="topbar-actions d-flex flex-wrap align-items-center gap-2">
              {isDataTableView || isReportView ? null : (
                <div className="input-group search-field">
                  <span className="input-group-text">
                    <Search size={18} />
                  </span>
                  <input id="search" className="form-control" type="search" placeholder={view === 'penjualan' ? 'Cari rekap, outlet, tanggal' : 'Cari order, menu, staff'} />
                </div>
              )}
              {isReportView ? null : <button className="btn primary-button" type="button" onClick={() => {
                if (view === 'master-staff') {
                  setStaffCreateSignal((current) => current + 1);
                  return;
                }

                if (view === 'master-outlet') {
                  setOutletCreateSignal((current) => current + 1);
                  return;
                }

                if (view === 'master-category') {
                  setCategoryCreateSignal((current) => current + 1);
                  return;
                }

                if (view === 'master-menu') {
                  setMenuCreateSignal((current) => current + 1);
                  return;
                }

                if (view === 'penjualan') {
                  setSalesRecapCreateSignal((current) => current + 1);
                  return;
                }

                if (view === 'pengeluaran') {
                  setExpenseCreateSignal((current) => current + 1);
                }
              }}>
                <Plus size={18} />
                {view === 'master-staff' ? 'User Baru' : view === 'master-outlet' ? 'Outlet Baru' : view === 'master-category' ? 'Kategori Baru' : view === 'master-menu' ? 'Menu Baru' : view === 'penjualan' ? 'Rekap Baru' : view === 'pengeluaran' ? 'Pengeluaran Baru' : 'Order Baru'}
              </button>}
            </div>
          </header>
        ) : null}

        {view === 'master-staff' ? <StaffView createSignal={staffCreateSignal} /> : null}
        {view === 'master-outlet' ? <OutletView createSignal={outletCreateSignal} /> : null}
        {view === 'master-category' ? <CategoryView createSignal={categoryCreateSignal} /> : null}
        {view === 'master-menu' ? <MenuView createSignal={menuCreateSignal} /> : null}
        {view === 'penjualan' ? <SalesRecapView createSignal={salesRecapCreateSignal} userId={userId} roleId={roleId} /> : null}
        {view === 'pengeluaran' ? <ExpenseView createSignal={expenseCreateSignal} userId={userId} roleId={roleId} /> : null}
        {view === 'report-sales-outlet' ? <SalesReportView mode="outlet" /> : null}
        {view === 'report-sales-combined' ? <SalesReportView mode="combined" /> : null}
        {view === 'report-general' ? <ReportView /> : null}
        {!isDataTableView && !isReportView ? <DashboardView /> : null}

        <footer className="content-footer">
          Copyright &copy; bbc-zone.github.io
        </footer>
      </main>

      {isUserInfoOpen ? (
        <UserInfoModal form={userInfoForm} error={userInfoError} onChange={updateUserInfoField} onClose={closeUserInfo} onSubmit={submitUserInfo} />
      ) : null}

      {isPasswordOpen ? (
        <ChangePasswordModal form={passwordForm} error={passwordError} onChange={updatePasswordField} onClose={closeChangePassword} onSubmit={submitChangePassword} />
      ) : null}

      {passwordAlert ? (
        <AlertModal eyebrow="Ganti password" message={passwordAlert} onClose={() => setPasswordAlert('')} />
      ) : null}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
