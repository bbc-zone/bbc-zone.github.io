import { useEffect, useMemo, useRef, useState } from 'react';
import { CreditCard, Pencil, Plus, X } from 'lucide-react';
import DataTable from 'datatables.net-react';
import { TransactionDeleteModal } from '../components/TransactionDeleteModal';
import { postApi } from '../lib/api';
import { emptyExpenseForm, expenseCategories, expenseTableOptions, formatCurrency, formatDate, normalizeExpense, paymentMethods } from '../features/expense/expenseUtils';

export function ExpenseView({ createSignal, userId, roleId }) {
  const [expenses, setExpenses] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm);
  const [modalMode, setModalMode] = useState('new');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [formError, setFormError] = useState('');
  const expenseTableRef = useRef(null);
  const lastCreateSignalRef = useRef(createSignal);

  useEffect(() => {
    postApi('../api/expenses.php', { action: 'outlets' })
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

  function reloadExpenseTable() {
    expenseTableRef.current?.dt()?.ajax.reload(null, false);
  }

  function openCreateModal() {
    setModalMode('new');
    setFormError('');
    setExpenseForm(emptyExpenseForm);
    setIsModalOpen(true);
  }

  function openEditModal(expense) {
    setModalMode('edit');
    setFormError('');
    setExpenseForm(normalizeExpense(expense));
    setIsModalOpen(true);
  }

  function updateExpenseField(field, value) {
    setExpenseForm((current) => ({ ...current, [field]: value }));
  }

  function handleExpenseSubmit(event) {
    event.preventDefault();

    const nextExpense = normalizeExpense(expenseForm);
    const action = modalMode === 'edit' ? 'update' : 'create';

    if (!nextExpense.expense_date || !nextExpense.category || Number(nextExpense.amount || 0) <= 0) {
      setFormError('Tanggal, kategori, dan nominal wajib diisi.');
      return;
    }

    postApi('../api/expenses.php', {
      action,
      ...nextExpense,
    })
      .then((payload) => {
        if (!payload.ok) {
          setFormError(payload.message || 'Pengeluaran gagal disimpan.');
          return;
        }

        setIsModalOpen(false);
        reloadExpenseTable();
      })
      .catch(() => setFormError('API gagal dihubungi.'));
  }

  function handleTableAction(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const expenseId = decodeURIComponent(button.dataset.id || '');
    const selectedExpense = expenses.find((expense) => expense.expense_id === expenseId);

    if (!selectedExpense) {
      return;
    }

    if (button.dataset.action === 'edit') {
      openEditModal(selectedExpense);
      return;
    }

    if (button.dataset.action === 'delete') {
      setDeleteError('');
      setDeleteTarget(selectedExpense);
    }
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
    setDeleteError('');
  }

  function confirmDeleteExpense(approval = {}) {
    if (!deleteTarget) {
      return;
    }

    postApi('../api/expenses.php', {
      action: 'delete',
      expense_id: deleteTarget.expense_id,
      userid: userId,
      ...approval,
    })
      .then((payload) => {
        if (!payload.ok) {
          setDeleteError(payload.message || 'Autentikasi gagal.');
          return;
        }

        closeDeleteModal();
        reloadExpenseTable();
      })
      .catch(() => setDeleteError('Autentikasi gagal.'));
  }

  const expenseColumns = useMemo(() => [
    {
      title: 'Tanggal',
      data: 'expense_date',
      render: (data) => formatDate(data),
    },
    {
      title: 'Outlet',
      data: 'outlet_name',
      render: (data) => data || 'Pusat / Umum',
    },
    { title: 'Kategori', data: 'category' },
    { title: 'Deskripsi', data: 'description' },
    {
      title: 'Nominal',
      data: 'amount',
      render: (data) => formatCurrency(data),
    },
    { title: 'Pembayaran', data: 'payment_method' },
    {
      title: 'Aksi',
      data: null,
      orderable: false,
      searchable: false,
      render: (_data, _type, row) => {
        const id = encodeURIComponent(String(row.expense_id));

        return `
          <div class="staff-actions outlet-actions">
            <button class="btn btn-sm staff-action edit" type="button" data-action="edit" data-id="${id}">Edit</button>
            <button class="btn btn-sm staff-action delete" type="button" data-action="delete" data-id="${id}">Hapus</button>
          </div>
        `;
      },
    },
  ], []);

  const expenseAjax = useMemo(() => (request, callback) => {
    postApi('../api/expenses.php', { ...request, action: 'datatable' })
      .then((payload) => {
        const rows = Array.isArray(payload.data) ? payload.data.map(normalizeExpense) : [];

        setExpenses(rows);
        callback({
          draw: Number(payload.draw ?? request.draw ?? 0),
          recordsTotal: Number(payload.recordsTotal ?? 0),
          recordsFiltered: Number(payload.recordsFiltered ?? 0),
          data: rows,
        });
      })
      .catch(() => {
        setExpenses([]);
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
                  <p className="eyebrow">Pengeluaran</p>
                  <h2>Daftar Pengeluaran</h2>
                </div>
              </div>

              <div className="table-responsive order-table-wrap" onClick={handleTableAction}>
                <DataTable
                  ref={expenseTableRef}
                  className="table table-hover align-middle navia-data-table"
                  ajax={expenseAjax}
                  columns={expenseColumns}
                  options={expenseTableOptions}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <span className="section-icon">
                  <CreditCard size={22} />
                </span>
                <div>
                  <p className="eyebrow">Pengeluaran</p>
                  <h2 id="expense-modal-title">{modalMode === 'edit' ? 'Edit Pengeluaran' : 'Pengeluaran Baru'}</h2>
                </div>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="master-form modal-form" onSubmit={handleExpenseSubmit}>
              {formError ? <div className="alert alert-danger mb-1">{formError}</div> : null}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="expense-date">Tanggal</label>
                  <input className="form-control" id="expense-date" type="date" value={expenseForm.expense_date} onChange={(event) => updateExpenseField('expense_date', event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="expense-outlet">Outlet</label>
                  <select className="form-select" id="expense-outlet" value={expenseForm.outlet_id} onChange={(event) => updateExpenseField('outlet_id', event.target.value)}>
                    <option value="">Pusat / Umum</option>
                    {outlets.map((outlet) => (
                      <option value={outlet.id} key={outlet.id}>{outlet.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="expense-category">Kategori</label>
                  <select className="form-select" id="expense-category" value={expenseForm.category} onChange={(event) => updateExpenseField('category', event.target.value)} required>
                    {expenseCategories.map((category) => (
                      <option value={category} key={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="expense-amount">Nominal</label>
                  <input className="form-control" id="expense-amount" type="number" min="0" step="100" value={expenseForm.amount} onChange={(event) => updateExpenseField('amount', event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="expense-payment">Pembayaran</label>
                  <select className="form-select" id="expense-payment" value={expenseForm.payment_method} onChange={(event) => updateExpenseField('payment_method', event.target.value)}>
                    {paymentMethods.map((method) => (
                      <option value={method} key={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="expense-description">Deskripsi</label>
                  <textarea className="form-control" id="expense-description" rows="3" value={expenseForm.description} onChange={(event) => updateExpenseField('description', event.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="expense-notes">Catatan</label>
                  <textarea className="form-control" id="expense-notes" rows="3" value={expenseForm.notes} onChange={(event) => updateExpenseField('notes', event.target.value)} />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn primary-button" type="submit">
                  {modalMode === 'edit' ? <Pencil size={18} /> : <Plus size={18} />}
                  {modalMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Pengeluaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <TransactionDeleteModal
          roleId={roleId}
          title="Hapus pengeluaran"
          targetText={`${formatDate(deleteTarget.expense_date)} - ${deleteTarget.category} - ${formatCurrency(deleteTarget.amount)}`}
          error={deleteError}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteExpense}
        />
      ) : null}
    </>
  );
}
