import { useEffect, useMemo, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { SalesOrderDetailModal } from '../components/SalesOrderDetailModal';
import { postApi } from '../lib/api';
import { formatCurrency, formatDate } from '../features/expense/expenseUtils';

const today = new Date();
const defaultFilters = {
  date_from: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10),
  date_to: today.toISOString().slice(0, 10),
  outlet_id: '',
};

const emptySalesReport = {
  summary: {
    total_sales: 0,
    total_transactions: 0,
    cash_amount: 0,
    qris_amount: 0,
    delivery_amount: 0,
    other_amount: 0,
  },
  daily: [],
  rows: [],
};

function numberValue(value) {
  return Number(value || 0);
}

function chartDate(value) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`));
}

export function SalesDailyChart({ rows }) {
  const maxValue = Math.max(...rows.map((row) => numberValue(row.total_sales)), 0);
  const chartWidth = Math.max(720, rows.length * 62 + 80);
  const chartHeight = 260;
  const baseline = 204;
  const top = 28;
  const plotHeight = baseline - top;

  if (rows.length === 0 || maxValue <= 0) {
    return (
      <div className="sales-chart-empty">
        Belum ada penjualan di periode ini.
      </div>
    );
  }

  const barWidth = 34;

  return (
    <div className="sales-chart-scroll">
      <svg className="sales-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Grafik penjualan per hari">
        <line x1="40" y1={baseline} x2={chartWidth - 24} y2={baseline} />
        {rows.map((row, index) => {
          const value = numberValue(row.total_sales);
          const height = Math.max(4, (value / maxValue) * plotHeight);
          const x = 52 + index * 62;
          const y = baseline - height;

          return (
            <g key={`${row.sales_date}-${index}`}>
              <rect x={x} y={y} width={barWidth} height={height} rx="6" />
              <text className="sales-chart-value" x={x + barWidth / 2} y={Math.max(14, y - 8)} textAnchor="middle">
                {Number(value / 1000).toLocaleString('id-ID')}k
              </text>
              <text className="sales-chart-label" x={x + barWidth / 2} y="232" textAnchor="middle">
                {chartDate(row.sales_date)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SalesReportView({ mode }) {
  const isCombined = mode === 'combined';
  const [filters, setFilters] = useState(defaultFilters);
  const [outlets, setOutlets] = useState([]);
  const [report, setReport] = useState(emptySalesReport);
  const [detailTarget, setDetailTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    postApi('../api/report.php', { action: 'outlets' })
      .then((payload) => setOutlets(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setOutlets([]));
  }, []);

  useEffect(() => {
    loadReport();
  }, [mode]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function loadReport(event) {
    event?.preventDefault();
    setIsLoading(true);
    setError('');

    postApi('../api/report.php', {
      action: isCombined ? 'salesCombined' : 'salesOutlet',
      date_from: filters.date_from,
      date_to: filters.date_to,
      outlet_id: isCombined ? '' : filters.outlet_id,
    })
      .then((payload) => {
        if (!payload.ok) {
          setError(payload.message || 'Sales report gagal dimuat.');
          setReport(emptySalesReport);
          return;
        }

        setReport({
          summary: payload.summary || emptySalesReport.summary,
          daily: Array.isArray(payload.daily) ? payload.daily : [],
          rows: Array.isArray(payload.rows) ? payload.rows : [],
        });
      })
      .catch(() => {
        setError('Sales report gagal dimuat.');
        setReport(emptySalesReport);
      })
      .finally(() => setIsLoading(false));
  }

  const summary = report.summary || emptySalesReport.summary;
  const title = isCombined ? 'Sales Report Gabungan' : 'Sales Report Per Outlet';
  const tableTitle = isCombined ? 'Rekap harian gabungan' : 'Rekap harian per outlet';
  const tableRows = useMemo(() => report.rows || [], [report.rows]);

  return (
    <section className="row g-3">
      <div className="col-12">
        <article className="card panel">
          <div className="card-body">
            <div className="d-flex flex-column flex-xl-row align-items-xl-end justify-content-between gap-3 mb-3">
              <div>
                <p className="eyebrow">Report penjualan</p>
                <h2>{title}</h2>
              </div>

              <form className={`report-filter ${isCombined ? 'combined' : ''}`} onSubmit={loadReport}>
                <div>
                  <label className="form-label" htmlFor="sales-report-from">Dari</label>
                  <input className="form-control" id="sales-report-from" type="date" value={filters.date_from} onChange={(event) => updateFilter('date_from', event.target.value)} />
                </div>
                <div>
                  <label className="form-label" htmlFor="sales-report-to">Sampai</label>
                  <input className="form-control" id="sales-report-to" type="date" value={filters.date_to} onChange={(event) => updateFilter('date_to', event.target.value)} />
                </div>
                {!isCombined ? (
                  <div>
                    <label className="form-label" htmlFor="sales-report-outlet">Outlet</label>
                    <select className="form-select" id="sales-report-outlet" value={filters.outlet_id} onChange={(event) => updateFilter('outlet_id', event.target.value)}>
                      <option value="">Semua outlet</option>
                      {outlets.map((outlet) => (
                        <option value={outlet.id} key={outlet.id}>{outlet.name}</option>
                      ))}
                    </select>
                  </div>
                ) : null}
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
                <div className="report-card">
                  <span>Total Transaksi</span>
                  <strong>{Number(summary.total_transactions || 0).toLocaleString('id-ID')}</strong>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-xxl-3">
                <div className="report-card">
                  <span>Cash</span>
                  <strong>{formatCurrency(summary.cash_amount)}</strong>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-xxl-3">
                <div className="report-card">
                  <span>QRIS</span>
                  <strong>{formatCurrency(summary.qris_amount)}</strong>
                </div>
              </div>
            </div>

            <div className="sales-report-layout">
              <div className="report-section">
                <div className="report-section-title">
                  <BarChart3 size={18} />
                  <h3>Grafik per hari</h3>
                </div>
                <SalesDailyChart rows={report.daily || []} />
              </div>

              <div className="report-section">
                <div className="report-section-title">
                  <BarChart3 size={18} />
                  <h3>{tableTitle}</h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle navia-data-table report-table sales-report-table">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        {!isCombined ? <th>Outlet</th> : null}
                        <th>Penjualan</th>
                        <th>Transaksi</th>
                        <th>Cash</th>
                        <th>QRIS</th>
                        <th>Delivery</th>
                        <th>Lainnya</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.length > 0 ? tableRows.map((row, index) => (
                        <tr key={`${row.sales_date}-${row.outlet_id || 'gabungan'}-${index}`}>
                          <td>{formatDate(row.sales_date)}</td>
                          {!isCombined ? <td>{row.outlet_name}</td> : null}
                          <td>{formatCurrency(row.total_sales)}</td>
                          <td>{Number(row.total_transactions || 0).toLocaleString('id-ID')}</td>
                          <td>{formatCurrency(row.cash_amount)}</td>
                          <td>{formatCurrency(row.qris_amount)}</td>
                          <td>{formatCurrency(row.delivery_amount)}</td>
                          <td>{formatCurrency(row.other_amount)}</td>
                          <td>
                            <button
                              className="btn btn-sm staff-action detail"
                              type="button"
                              onClick={() => setDetailTarget(row)}
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={isCombined ? 8 : 9}>Belum ada data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <p className="report-period">Periode: {formatDate(filters.date_from)} sampai {formatDate(filters.date_to)}</p>
          </div>
        </article>
      </div>

      {detailTarget ? (
        <SalesOrderDetailModal
          salesDate={detailTarget.sales_date}
          outletId={isCombined ? '' : detailTarget.outlet_id}
          title={isCombined ? `Invoice ${formatDate(detailTarget.sales_date)}` : `${formatDate(detailTarget.sales_date)} - ${detailTarget.outlet_name}`}
          onClose={() => setDetailTarget(null)}
        />
      ) : null}
    </section>
  );
}
