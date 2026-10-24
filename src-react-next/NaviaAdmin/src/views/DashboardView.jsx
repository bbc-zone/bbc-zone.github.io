import { useEffect, useState } from 'react';
import { BarChart3, CreditCard, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDate } from '../features/expense/expenseUtils';
import { postApi } from '../lib/api';
import { SalesDailyChart } from './SalesReportView';

const emptyDashboard = {
  summary: {
    total_sales: 0,
    total_expense: 0,
    net_total: 0,
    total_transactions: 0,
  },
  outlets: [],
  expense_categories: [],
  daily: [],
};

function localDate(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function monthStartDate() {
  const today = new Date();
  return localDate(new Date(today.getFullYear(), today.getMonth(), 1));
}

function todayDate() {
  return localDate(new Date());
}

function numberValue(value) {
  return Number(value || 0);
}

export function DashboardView() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dateFrom = monthStartDate();
  const dateTo = todayDate();

  useEffect(() => {
    loadDashboard();
  }, []);

  function loadDashboard() {
    setIsLoading(true);
    setError('');

    Promise.all([
      postApi('../api/report.php', { action: 'summary', date_from: dateFrom, date_to: dateTo, outlet_id: '' }),
      postApi('../api/report.php', { action: 'salesCombined', date_from: dateFrom, date_to: dateTo, outlet_id: '' }),
    ])
      .then(([generalPayload, salesPayload]) => {
        if (!generalPayload.ok || !salesPayload.ok) {
          setError('Dashboard gagal dimuat.');
          setDashboard(emptyDashboard);
          return;
        }

        setDashboard({
          summary: generalPayload.summary || emptyDashboard.summary,
          outlets: Array.isArray(generalPayload.outlets) ? generalPayload.outlets : [],
          expense_categories: Array.isArray(generalPayload.expense_categories) ? generalPayload.expense_categories : [],
          daily: Array.isArray(salesPayload.daily) ? salesPayload.daily : [],
        });
      })
      .catch(() => {
        setError('Dashboard gagal dimuat.');
        setDashboard(emptyDashboard);
      })
      .finally(() => setIsLoading(false));
  }

  const summary = dashboard.summary || emptyDashboard.summary;

  return (
    <section className="row g-3">
      <div className="col-12">
        <article className="card panel">
          <div className="card-body">
            <div className="d-flex flex-column flex-xl-row align-items-xl-end justify-content-between gap-3 mb-3">
              <div>
                <p className="eyebrow">Dashboard</p>
                <h2>Ringkasan Operasional</h2>
              </div>

              <button className="btn primary-button" type="button" onClick={loadDashboard} disabled={isLoading}>
                <RefreshCw size={18} />
                {isLoading ? 'Memuat' : 'Perbarui'}
              </button>
            </div>

            {error ? <div className="alert alert-danger mb-3">{error}</div> : null}

            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6 col-xxl-3">
                <div className="report-card">
                  <span>Total Penjualan</span>
                  <strong>{formatCurrency(summary.total_sales)}</strong>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-xxl-3">
                <div className="report-card expense">
                  <span>Total Pengeluaran</span>
                  <strong>{formatCurrency(summary.total_expense)}</strong>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-xxl-3">
                <div className={`report-card ${numberValue(summary.net_total) < 0 ? 'expense' : 'profit'}`}>
                  <span>Selisih Bersih</span>
                  <strong>{formatCurrency(summary.net_total)}</strong>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-xxl-3">
                <div className="report-card">
                  <span>Total Transaksi</span>
                  <strong>{Number(summary.total_transactions || 0).toLocaleString('id-ID')}</strong>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-xl-7">
                <div className="report-section dashboard-outlet-section">
                  <div className="report-section-title">
                    <BarChart3 size={18} />
                    <h3>Penjualan per Hari</h3>
                  </div>
                  <SalesDailyChart rows={dashboard.daily || []} />
                </div>
              </div>

              <div className="col-12 col-xl-5">
                <div className="report-section">
                  <div className="report-section-title">
                    <BarChart3 size={18} />
                    <h3>Rekap per Outlet</h3>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle navia-data-table report-table dashboard-report-table">
                      <thead>
                        <tr>
                          <th>Outlet</th>
                          <th>Penjualan</th>
                          <th>Pengeluaran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.outlets.length > 0 ? dashboard.outlets.map((row) => (
                          <tr key={`${row.outlet_id}-${row.outlet_name}`}>
                            <td>{row.outlet_name}</td>
                            <td>{formatCurrency(row.total_sales)}</td>
                            <td>{formatCurrency(row.total_expense)}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="3">Belum ada data</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="dashboard-final-total">
                    <span>TOTAL</span>
                    <strong>{formatCurrency(summary.net_total)}</strong>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="report-section">
                  <div className="report-section-title">
                    <CreditCard size={18} />
                    <h3>Pengeluaran per Kategori</h3>
                  </div>
                  <div className="expense-category-list dashboard-category-list">
                    {dashboard.expense_categories.length > 0 ? dashboard.expense_categories.map((row) => (
                      <div className="expense-category-row" key={row.category}>
                        <div>
                          <strong>{row.category}</strong>
                          <span>{row.total_rows} transaksi</span>
                        </div>
                        <b>{formatCurrency(row.total_expense)}</b>
                      </div>
                    )) : (
                      <p className="report-empty">Belum ada data</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="report-period">Periode: {formatDate(dateFrom)} sampai {formatDate(dateTo)}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
