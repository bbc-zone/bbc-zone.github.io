import { useEffect, useMemo, useRef, useState } from 'react';
import { ClipboardList, Pencil, Plus, X } from 'lucide-react';
import DataTable from 'datatables.net-react';
import { SalesOrderDetailModal } from '../components/SalesOrderDetailModal';
import { TransactionDeleteModal } from '../components/TransactionDeleteModal';
import { postApi } from '../lib/api';
import { emptySalesRecapForm, formatCurrency, formatDate, normalizeSalesRecap, officeRecapNotes, salesPaymentTotal, salesRecapTableOptions } from '../features/salesRecap/salesRecapUtils';

export function SalesRecapView({ createSignal, userId, roleId }) {
  const [recaps, setRecaps] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [recapForm, setRecapForm] = useState(emptySalesRecapForm);
  const [modalMode, setModalMode] = useState('new');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [formError, setFormError] = useState('');
  const recapTableRef = useRef(null);
  const lastCreateSignalRef = useRef(createSignal);

  useEffect(() => {
    postApi('../api/sales_recap.php', { action: 'outlets' })
      .then((payload) => {
        setOutlets(Array.isArray(payload.data) ? payload.data : []);
      })
      .catch(() => setOutlets([]));
  }, []);

  useEffect(() => {
    if (createSignal !== lastCreateSignalRef.current) {
      lastCreateSignalRef.current = createSignal;
      openCreateModal();
    }
  }, [createSignal]);

  useEffect(() => {
    if (isModalOpen && modalMode === 'new' && !recapForm.outlet_id && outlets.length > 0) {
      updateRecapField('outlet_id', firstOutletId());
    }
  }, [outlets, isModalOpen, modalMode, recapForm.outlet_id]);

  function firstOutletId() {
    return String(outlets[0]?.id ?? '');
  }

  function reloadRecapTable() {
    recapTableRef.current?.dt()?.ajax.reload(null, false);
  }

  function openCreateModal() {
    setModalMode('new');
    setFormError('');
    setRecapForm({ ...emptySalesRecapForm, outlet_id: firstOutletId() });
    setIsModalOpen(true);
  }

  function openEditModal(recap) {
    setModalMode('edit');
    setFormError('');
    setRecapForm(normalizeSalesRecap(recap));
    setIsModalOpen(true);
  }

  function updateRecapField(field, value) {
    setRecapForm((current) => ({ ...current, [field]: value }));
  }

  function handleRecapSubmit(event) {
    event.preventDefault();

    const nextRecap = normalizeSalesRecap(recapForm);
    nextRecap.notes = officeRecapNotes;
    const action = modalMode === 'edit' ? 'update' : 'create';

    if (!nextRecap.sales_date || !nextRecap.outlet_id) {
      setFormError('Tanggal dan outlet wajib diisi.');
      return;
    }

    if (Number(nextRecap.total_sales || 0) !== salesPaymentTotal(nextRecap)) {
      setFormError('Cash + QRIS + Delivery App harus sama dengan Total Penjualan.');
      return;
    }

    postApi('../api/sales_recap.php', {
      action,
      ...nextRecap,
    })
      .then((payload) => {
        if (!payload.ok) {
          setFormError(payload.message || 'Rekap penjualan gagal disimpan.');
          return;
        }

        setIsModalOpen(false);
        reloadRecapTable();
      })
      .catch(() => setFormError('API gagal dihubungi.'));
  }

  function handleTableAction(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const recapId = decodeURIComponent(button.dataset.id || '');
    const selectedRecap = recaps.find((recap) => recap.recap_id === recapId);

    if (!selectedRecap) {
      return;
    }

    if (button.dataset.action === 'detail') {
      setDetailTarget(selectedRecap);
      return;
    }

    if (button.dataset.action === 'edit') {
      openEditModal(selectedRecap);
      return;
    }

    if (button.dataset.action === 'delete') {
      setDeleteError('');
      setDeleteTarget(selectedRecap);
    }
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
    setDeleteError('');
  }

  function confirmDeleteRecap(approval = {}) {
    if (!deleteTarget) {
      return;
    }

    postApi('../api/sales_recap.php', {
      action: 'delete',
      recap_id: deleteTarget.recap_id,
      userid: userId,
      ...approval,
    })
      .then((payload) => {
        if (!payload.ok) {
          setDeleteError(payload.message || 'Autentikasi gagal.');
          return;
        }

        closeDeleteModal();
        reloadRecapTable();
      })
      .catch(() => setDeleteError('Autentikasi gagal.'));
  }

  const recapColumns = useMemo(() => [
    {
      title: 'Tanggal',
      data: 'sales_date',
      render: (data) => formatDate(data),
    },
    { title: 'Outlet', data: 'outlet_name' },
    { title: 'Kategori Usaha', data: 'category_name' },
    {
      title: 'Total Penjualan',
      data: 'total_sales',
      render: (data) => formatCurrency(data),
    },
    { title: 'Transaksi', data: 'total_transactions' },
    {
      title: 'Cash',
      data: 'cash_amount',
      render: (data) => formatCurrency(data),
    },
    {
      title: 'QRIS',
      data: 'qris_amount',
      render: (data) => formatCurrency(data),
    },
    {
      title: 'Delivery',
      data: 'delivery_amount',
      render: (data) => formatCurrency(data),
    },
    {
      title: 'Lainnya',
      data: 'other_amount',
      render: (data) => formatCurrency(data),
    },
    {
      title: 'Aksi',
      data: null,
      orderable: false,
      searchable: false,
      render: (_data, _type, row) => {
        const id = encodeURIComponent(String(row.recap_id));

        return `
          <div class="staff-actions outlet-actions">
            <button class="btn btn-sm staff-action detail" type="button" data-action="detail" data-id="${id}">Detail</button>
            <button class="btn btn-sm staff-action edit" type="button" data-action="edit" data-id="${id}">Edit</button>
            <button class="btn btn-sm staff-action delete" type="button" data-action="delete" data-id="${id}">Hapus</button>
          </div>
        `;
      },
    },
  ], []);

  const recapAjax = useMemo(() => (request, callback) => {
    postApi('../api/sales_recap.php', { ...request, action: 'datatable' })
      .then((payload) => {
        const rows = Array.isArray(payload.data) ? payload.data.map(normalizeSalesRecap) : [];

        setRecaps(rows);
        callback({
          draw: Number(payload.draw ?? request.draw ?? 0),
          recordsTotal: Number(payload.recordsTotal ?? 0),
          recordsFiltered: Number(payload.recordsFiltered ?? 0),
          data: rows,
        });
      })
      .catch(() => {
        setRecaps([]);
        callback({
          draw: Number(request.draw ?? 0),
          recordsTotal: 0,
          recordsFiltered: 0,
          data: [],
        });
      });
  }, []);

  return (
    <>
      <section className="row g-3">
        <div className="col-12">
          <article className="card panel h-100">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                  <p className="eyebrow">Rekap penjualan</p>
                  <h2>Daftar Rekap Penjualan</h2>
                </div>
              </div>

              <div className="table-responsive order-table-wrap" onClick={handleTableAction}>
                <DataTable
                  ref={recapTableRef}
                  className="table table-hover align-middle navia-data-table"
                  ajax={recapAjax}
                  columns={recapColumns}
                  options={salesRecapTableOptions}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="sales-recap-modal-title">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <span className="section-icon">
                  <ClipboardList size={22} />
                </span>
                <div>
                  <p className="eyebrow">Rekap penjualan</p>
                  <h2 id="sales-recap-modal-title">{modalMode === 'edit' ? 'Edit Rekap' : 'Rekap Baru'}</h2>
                </div>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="master-form modal-form" onSubmit={handleRecapSubmit}>
              {formError ? <div className="alert alert-danger mb-1">{formError}</div> : null}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-date">Tanggal</label>
                  <input className="form-control" id="recap-date" type="date" value={recapForm.sales_date} onChange={(event) => updateRecapField('sales_date', event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-outlet">Outlet</label>
                  <select className="form-select" id="recap-outlet" value={recapForm.outlet_id} onChange={(event) => updateRecapField('outlet_id', event.target.value)} required>
                    <option value="">Pilih outlet</option>
                    {outlets.map((outlet) => (
                      <option value={outlet.id} key={outlet.id}>
                        {outlet.category_name ? `${outlet.name} - ${outlet.category_name}` : outlet.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-total-sales">Total Penjualan</label>
                  <input className="form-control" id="recap-total-sales" type="number" min="0" step="100" value={recapForm.total_sales} onChange={(event) => updateRecapField('total_sales', event.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-total-transactions">Jumlah Transaksi</label>
                  <input className="form-control" id="recap-total-transactions" type="number" min="0" step="1" value={recapForm.total_transactions} onChange={(event) => updateRecapField('total_transactions', event.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-cash">Cash</label>
                  <input className="form-control" id="recap-cash" type="number" min="0" step="100" value={recapForm.cash_amount} onChange={(event) => updateRecapField('cash_amount', event.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-qris">QRIS</label>
                  <input className="form-control" id="recap-qris" type="number" min="0" step="100" value={recapForm.qris_amount} onChange={(event) => updateRecapField('qris_amount', event.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-delivery">Delivery App</label>
                  <input className="form-control" id="recap-delivery" type="number" min="0" step="100" value={recapForm.delivery_amount} onChange={(event) => updateRecapField('delivery_amount', event.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="recap-other">Lainnya</label>
                  <input className="form-control" id="recap-other" type="number" min="0" step="100" value={recapForm.other_amount} onChange={(event) => updateRecapField('other_amount', event.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="recap-notes">Catatan</label>
                  <textarea className="form-control" id="recap-notes" rows="3" value={officeRecapNotes} readOnly />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn primary-button" type="submit">
                  {modalMode === 'edit' ? <Pencil size={18} /> : <Plus size={18} />}
                  {modalMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Rekap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <TransactionDeleteModal
          roleId={roleId}
          title="Hapus rekap"
          targetText={`${formatDate(deleteTarget.sales_date)} - ${deleteTarget.outlet_name}${deleteTarget.category_name ? ` (${deleteTarget.category_name})` : ''}`}
          error={deleteError}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteRecap}
        />
      ) : null}

      {detailTarget ? (
        <SalesOrderDetailModal
          salesDate={detailTarget.sales_date}
          outletId={detailTarget.outlet_id}
          title={`${formatDate(detailTarget.sales_date)} - ${detailTarget.outlet_name}${detailTarget.category_name ? ` (${detailTarget.category_name})` : ''}`}
          onClose={() => setDetailTarget(null)}
        />
      ) : null}
    </>
  );
}
