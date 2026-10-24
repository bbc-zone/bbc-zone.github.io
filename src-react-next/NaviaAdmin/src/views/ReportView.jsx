import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { postApi } from '../lib/api';
import { formatCurrency, formatDate } from '../features/expense/expenseUtils';

const today = new Date();
const defaultFilters = {
  date_from: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10),
  date_to: today.toISOString().slice(0, 10),
  outlet_id: '',
};

const emptyReport = {
  summary: {
    total_sales: 0,
    total_expense: 0,
    net_total: 0,
    total_transactions: 0,
  },
  outlets: [],
  expense_categories: [],
};

function numberValue(value) {
  return Number(value || 0);
}

export function ReportView() {
  const [filters, setFilters] = useState(defaultFilters);
  const [outlets, setOutlets] = useState([]);
  const [report, setReport] = useState(emptyReport);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    postApi('../api/report.php', { action: 'outlets' })
      .then((payload) => setOutlets(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setOutlets([]));
  }, []);

  useEffect(() => {
    loadReport();
  }, []);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function loadReport(event) {
    event?.preventDefault();
    setIsLoading(true);
    setError('');

    postApi('../api/report.php', { action: 'summary', ...filters })
      .then((payload) => {
        if (!payload.ok) {
          setError(payload.message || 'Report gagal dimuat.');
          setReport(emptyReport);
          return;
        }

        setReport({
          summary: payload.summary || emptyReport.summary,
          outlets: Array.isArray(payload.outlets) ? payload.outlets : [],
          expense_categories: Array.isArray(payload.expense_categories) ? payload.expense_categories : [],
        });
      })
      .catch(() => {
        setError('Report gagal dimuat.');
        setReport(emptyReport);
      })
      .finally(() => setIsLoading(false));
  }

  const summary = report.summary || emptyReport.summary;

  return (
    <section className="row g-3">
      <div className="col-12">
        <article className="card panel">
          <div className="card-body">
            <div className="d-flex flex-column flex-xl-row align-items-xl-end justify-content-between gap-3 mb-3">
              <div>
                <p className="eyebrow">Report</p>
                <h2>Laporan Ringkas</h2>
              </div>

              <form className="report-filter" onSubmit={loadReport}>
                <div>
                  <label className="form-label" htmlFor="report-from">Dari</label>
                  <input className="form-control" id="report-from" type="date" value={filters.date_from} onChange={(event) => updateFilter('date_from', event.target.value)} />
                </div>
                <div>
                  <label className="form-label" htmlFor="report-to">Sampai</label>
                  <input className="form-control" id="report-to" type="date" value={filters.date_to} onChange={(event) => updateFilter('date_to', event.target.value)} />
                </div>
                <div>
                  <label className="form-label" htmlFor="report-outlet">Outlet</label>
                  <select className="form-select" id="report-outlet" value={filters.outlet_id} onChange={(event) => updateFilter('outlet_id', event.target.value)}>
                    <option value="">Semua outlet</option>
                    {outlets.map((outlet) => (
                      <option value={outlet.id} key={outlet.id}>{outlet.name}</option>
                    ))}
                  </select>
                </div>
                <button className="btn primary-button" type="submit" disabled={isLoading}>
                  <RefreshCw size={18} />
                  {isLoading ? 'Memuat' : 'Tampilkan'}
                </button>
              </form>
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
              <div className="col-12 col-xl-8">
                <div className="report-section">
                  <div className="report-section-title">
                    <BarChart3 size={18} />
                    <h3>Rekap per Outlet</h3>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle navia-data-table report-table">
                      <thead>
                        <tr>
                          <th>Outlet</th>
                          <th>Penjualan</th>
                          <th>Pengeluaran</th>
                          <th>Bersih</th>
                          <th>Transaksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.outlets.length > 0 ? report.outlets.map((row) => (
                          <tr key={`${row.outlet_id}-${row.outlet_name}`}>
                            <td>{row.outlet_name}</td>
                            <td>{formatCurrency(row.total_sales)}</td>
                            <td>{formatCurrency(row.total_expense)}</td>
                            <td>{formatCurrency(row.net_total)}</td>
                            <td>{Number(row.total_transactions || 0).toLocaleString('id-ID')}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="5">Belum ada data</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="report-section">
                  <div className="report-section-title">
                    <BarChart3 size={18} />
                    <h3>Pengeluaran per Kategori</h3>
                  </div>
                  <div className="expense-category-list">
                    {report.expense_categories.length > 0 ? report.expense_categories.map((row) => (
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

            <p className="report-period">Periode: {formatDate(filters.date_from)} sampai {formatDate(filters.date_to)}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
