import { useEffect, useMemo, useRef, useState } from 'react';
import { Pencil, Plus, Store, X } from 'lucide-react';
import DataTable from 'datatables.net-react';
import { postApi } from '../lib/api';
import { emptyOutletForm, normalizeOutlet, outletTableOptions } from '../features/outlet/outletUtils';

export function OutletView({ createSignal }) {
  const [outlets, setOutlets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [outletForm, setOutletForm] = useState(emptyOutletForm);
  const [modalMode, setModalMode] = useState('new');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const outletTableRef = useRef(null);
  const lastCreateSignalRef = useRef(createSignal);

  useEffect(() => {
    postApi('../api/categories.php', { action: 'list' })
      .then((payload) => setCategories(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (createSignal !== lastCreateSignalRef.current) {
      lastCreateSignalRef.current = createSignal;
      openCreateModal();
    }
  }, [createSignal]);

  useEffect(() => {
    if (isModalOpen && modalMode === 'new' && !outletForm.category_id && categories.length > 0) {
      updateOutletField('category_id', String(categories[0].id));
    }
  }, [categories, isModalOpen, modalMode, outletForm.category_id]);

  function reloadOutletTable() {
    outletTableRef.current?.dt()?.ajax.reload(null, false);
  }

  function openCreateModal() {
    setModalMode('new');
    setFormError('');
    setOutletForm(emptyOutletForm);
    setIsModalOpen(true);
  }

  function openEditModal(outlet) {
    setModalMode('edit');
    setFormError('');
    setOutletForm(normalizeOutlet(outlet));
    setIsModalOpen(true);
  }

  function updateOutletField(field, value) {
    setOutletForm((current) => ({ ...current, [field]: value }));
  }

  function handleOutletSubmit(event) {
    event.preventDefault();

    const nextOutlet = normalizeOutlet(outletForm);
    const action = modalMode === 'edit' ? 'update' : 'create';

    if (!nextOutlet.outlet_name.trim()) {
      setFormError('Nama outlet wajib diisi.');
      return;
    }

    if (!nextOutlet.category_id) {
      setFormError('Kategori usaha wajib dipilih.');
      return;
    }

    postApi('../api/outlets.php', {
      action,
      outlet_id: nextOutlet.outlet_id,
      outlet_name: nextOutlet.outlet_name,
      category_id: nextOutlet.category_id,
      outlet_address: nextOutlet.outlet_address,
    })
      .then((payload) => {
        if (!payload.ok) {
          setFormError(payload.message || 'Data outlet gagal disimpan.');
          return;
        }

        setIsModalOpen(false);
        reloadOutletTable();
      })
      .catch(() => setFormError('API gagal dihubungi.'));
  }

  function handleTableAction(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const outletId = decodeURIComponent(button.dataset.id || '');
    const selectedOutlet = outlets.find((outlet) => outlet.outlet_id === outletId);

    if (!selectedOutlet) {
      return;
    }

    if (button.dataset.action === 'edit') {
      openEditModal(selectedOutlet);
      return;
    }

    if (button.dataset.action === 'delete') {
      setDeleteTarget(selectedOutlet);
    }
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
  }

  function confirmDeleteOutlet() {
    if (!deleteTarget) {
      return;
    }

    postApi('../api/outlets.php', { action: 'delete', outlet_id: deleteTarget.outlet_id })
      .then(() => {
        closeDeleteModal();
        reloadOutletTable();
      })
      .catch(() => closeDeleteModal());
  }

  const outletColumns = useMemo(() => [
    { title: 'Nama Outlet', data: 'outlet_name' },
    { title: 'Kategori Usaha', data: 'category_name' },
    { title: 'Alamat', data: 'outlet_address' },
    {
      title: 'Aksi',
      data: null,
      orderable: false,
      searchable: false,
      render: (_data, _type, row) => {
        const id = encodeURIComponent(String(row.outlet_id));

        return `
          <div class="staff-actions outlet-actions">
            <button class="btn btn-sm staff-action edit" type="button" data-action="edit" data-id="${id}">Edit</button>
            <button class="btn btn-sm staff-action delete" type="button" data-action="delete" data-id="${id}">Hapus</button>
          </div>
        `;
      },
    },
  ], []);

  const outletAjax = useMemo(() => (request, callback) => {
    postApi('../api/outlets.php', { ...request, action: 'datatable' })
      .then((payload) => {
        const rows = Array.isArray(payload.data) ? payload.data.map(normalizeOutlet) : [];

        setOutlets(rows);
        callback({
          draw: Number(payload.draw ?? request.draw ?? 0),
          recordsTotal: Number(payload.recordsTotal ?? 0),
          recordsFiltered: Number(payload.recordsFiltered ?? 0),
          data: rows,
        });
      })
      .catch(() => {
        setOutlets([]);
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
                  <p className="eyebrow">Master outlet</p>
                  <h2>Daftar Outlet</h2>
                </div>
              </div>

              <div className="table-responsive order-table-wrap" onClick={handleTableAction}>
                <DataTable
                  ref={outletTableRef}
                  className="table table-hover align-middle navia-data-table"
                  ajax={outletAjax}
                  columns={outletColumns}
                  options={outletTableOptions}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="outlet-modal-title">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <span className="section-icon">
                  <Store size={22} />
                </span>
                <div>
                  <p className="eyebrow">Master outlet</p>
                  <h2 id="outlet-modal-title">{modalMode === 'edit' ? 'Edit Outlet' : 'Outlet Baru'}</h2>
                </div>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="master-form modal-form" onSubmit={handleOutletSubmit}>
              {formError ? <div className="alert alert-danger mb-1">{formError}</div> : null}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="outlet-name">Nama Outlet</label>
                  <input className="form-control" id="outlet-name" type="text" value={outletForm.outlet_name} onChange={(event) => updateOutletField('outlet_name', event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="outlet-category">Kategori Usaha</label>
                  <select className="form-select" id="outlet-category" value={outletForm.category_id} onChange={(event) => updateOutletField('category_id', event.target.value)} required>
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option value={category.id} key={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="outlet-address">Alamat</label>
                  <input className="form-control" id="outlet-address" type="text" value={outletForm.outlet_address} onChange={(event) => updateOutletField('outlet_address', event.target.value)} />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn primary-button" type="submit">
                  {modalMode === 'edit' ? <Pencil size={18} /> : <Plus size={18} />}
                  {modalMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Outlet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="delete-outlet-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Hapus outlet</p>
                <h2 id="delete-outlet-title">Yakin mau hapus?</h2>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            <div className="confirm-body">
              <p>{deleteTarget.outlet_name}</p>
              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={closeDeleteModal}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn danger-button" type="button" onClick={confirmDeleteOutlet}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
