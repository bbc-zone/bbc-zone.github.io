import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../features/expense/expenseUtils';
import { postApi } from '../lib/api';

const emptyDetail = {
  order: null,
  items: [],
};

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(String(value).replace(' ', 'T')));
}

export function SalesOrderDetailModal({ salesDate, outletId, title, onClose }) {
  const [orders, setOrders] = useState([]);
  const [selectedSalesId, setSelectedSalesId] = useState('');
  const [detail, setDetail] = useState(emptyDetail);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setOrders([]);
    setSelectedSalesId('');
    setDetail(emptyDetail);
    setError('');
    setIsLoadingOrders(true);

    postApi('../api/sales_orders.php', {
      action: 'listByRecap',
      sales_date: salesDate,
      outlet_id: outletId || '',
    })
      .then((payload) => {
        if (!payload.ok) {
          setError(payload.message || 'Daftar invoice gagal dimuat.');
          return;
        }

        const rows = Array.isArray(payload.data) ? payload.data : [];
        setOrders(rows);

        if (rows.length > 0) {
          setSelectedSalesId(String(rows[0].sales_id));
        }
      })
      .catch(() => setError('Daftar invoice gagal dimuat.'))
      .finally(() => setIsLoadingOrders(false));
  }, [salesDate, outletId]);

  useEffect(() => {
    if (!selectedSalesId) {
      setDetail(emptyDetail);
      return;
    }

    setIsLoadingDetail(true);
    setError('');

    postApi('../api/sales_orders.php', {
      action: 'detail',
      sales_id: selectedSalesId,
    })
      .then((payload) => {
        if (!payload.ok) {
          setError(payload.message || 'Detail invoice gagal dimuat.');
          setDetail(emptyDetail);
          return;
        }

        setDetail({
          order: payload.order || null,
          items: Array.isArray(payload.items) ? payload.items : [],
        });
      })
      .catch(() => {
        setError('Detail invoice gagal dimuat.');
        setDetail(emptyDetail);
      })
      .finally(() => setIsLoadingDetail(false));
  }, [selectedSalesId]);

  const selectedOrder = useMemo(
    () => orders.find((order) => String(order.sales_id) === String(selectedSalesId)) || null,
    [orders, selectedSalesId],
  );
  const order = detail.order || selectedOrder;

  return (
    <div className="modal-layer" role="presentation">
      <div className="modal-panel sales-detail-panel" role="dialog" aria-modal="true" aria-labelledby="sales-detail-title">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="section-icon">
              <ClipboardList size={22} />
            </span>
            <div>
              <p className="eyebrow">Detail penjualan</p>
              <h2 id="sales-detail-title">{title || 'Detail Invoice'}</h2>
            </div>
          </div>
          <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sales-detail-body">
          {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

          <div className="sales-detail-grid">
            <section className="sales-detail-list" aria-label="Daftar invoice">
              <div className="report-section-title">
                <ClipboardList size={18} />
                <h3>Daftar Invoice</h3>
              </div>

              {isLoadingOrders ? <p className="report-empty">Memuat invoice...</p> : null}

              {!isLoadingOrders && orders.length === 0 ? (
                <p className="report-empty">Belum ada invoice dari transaksi kasir/Telegram.</p>
              ) : null}

              <div className="invoice-list">
                {orders.map((invoice) => (
                  <button
                    className={`invoice-button ${String(invoice.sales_id) === String(selectedSalesId) ? 'active' : ''}`}
                    type="button"
                    key={invoice.sales_id}
                    onClick={() => setSelectedSalesId(String(invoice.sales_id))}
                  >
                    <span>
                      <strong>{invoice.invoice_no}</strong>
                      <small>{formatDateTime(invoice.sales_time)} - {invoice.outlet_name}</small>
                    </span>
                    <b>{formatCurrency(invoice.total)}</b>
                  </button>
                ))}
              </div>
            </section>

            <section className="sales-detail-content" aria-label="Detail invoice">
              <div className="report-section-title">
                <ClipboardList size={18} />
                <h3>Isi Invoice</h3>
              </div>

              {!order ? (
                <p className="report-empty">Pilih invoice untuk melihat detail.</p>
              ) : (
                <>
                  <div className="sales-detail-summary">
                    <div>
                      <span>Invoice</span>
                      <strong>{order.invoice_no}</strong>
                    </div>
                    <div>
                      <span>Waktu</span>
                      <strong>{formatDateTime(order.sales_time)}</strong>
                    </div>
                    <div>
                      <span>Outlet</span>
                      <strong>{order.outlet_name}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle navia-data-table report-table sales-items-table">
                      <thead>
                        <tr>
                          <th>Menu</th>
                          <th>Qty</th>
                          <th>Harga</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingDetail ? (
                          <tr>
                            <td colSpan="4">Memuat item...</td>
                          </tr>
                        ) : detail.items.length > 0 ? detail.items.map((item) => (
                          <tr key={item.detail_id}>
                            <td>{item.menu_name || '-'}</td>
                            <td>{Number(item.qty || 0).toLocaleString('id-ID')}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{formatCurrency(item.total)}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4">Belum ada item detail untuk invoice ini.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="sales-payment-summary">
                    <span>Cash {formatCurrency(order.cash_amount)}</span>
                    <span>QRIS {formatCurrency(order.qris_amount)}</span>
                    <span>Delivery {formatCurrency(order.delivery_amount)}</span>
                  </div>
                </>
              )}
            </section>
          </div>

          <p className="report-period">Tanggal: {formatDate(salesDate)}</p>
        </div>
      </div>
    </div>
  );
}
