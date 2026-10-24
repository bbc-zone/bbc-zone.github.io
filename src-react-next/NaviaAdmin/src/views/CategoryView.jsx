import { useEffect, useMemo, useRef, useState } from 'react';
import { Pencil, Plus, Tag, X } from 'lucide-react';
import DataTable from 'datatables.net-react';
import { postApi } from '../lib/api';
import { categoryTableOptions, emptyCategoryForm, normalizeCategory } from '../features/category/categoryUtils';

export function CategoryView({ createSignal }) {
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [modalMode, setModalMode] = useState('new');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [formError, setFormError] = useState('');
  const categoryTableRef = useRef(null);
  const lastCreateSignalRef = useRef(createSignal);

  useEffect(() => {
    if (createSignal !== lastCreateSignalRef.current) {
      lastCreateSignalRef.current = createSignal;
      openCreateModal();
    }
  }, [createSignal]);

  function reloadCategoryTable() {
    categoryTableRef.current?.dt()?.ajax.reload(null, false);
  }

  function openCreateModal() {
    setModalMode('new');
    setFormError('');
    setCategoryForm(emptyCategoryForm);
    setIsModalOpen(true);
  }

  function openEditModal(category) {
    setModalMode('edit');
    setFormError('');
    setCategoryForm(normalizeCategory(category));
    setIsModalOpen(true);
  }

  function updateCategoryField(field, value) {
    setCategoryForm((current) => ({ ...current, [field]: value }));
  }

  function handleCategorySubmit(event) {
    event.preventDefault();

    const nextCategory = normalizeCategory(categoryForm);
    const action = modalMode === 'edit' ? 'update' : 'create';

    if (!nextCategory.category_name.trim()) {
      setFormError('Nama kategori wajib diisi.');
      return;
    }

    postApi('../api/categories.php', {
      action,
      category_id: nextCategory.category_id,
      category_name: nextCategory.category_name,
    })
      .then((payload) => {
        if (!payload.ok) {
          setFormError(payload.message || 'Kategori gagal disimpan.');
          return;
        }

        setIsModalOpen(false);
        reloadCategoryTable();
      })
      .catch(() => setFormError('API gagal dihubungi.'));
  }

  function handleTableAction(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const categoryId = decodeURIComponent(button.dataset.id || '');
    const selectedCategory = categories.find((category) => category.category_id === categoryId);

    if (!selectedCategory) {
      return;
    }

    if (button.dataset.action === 'edit') {
      openEditModal(selectedCategory);
      return;
    }

    if (button.dataset.action === 'delete') {
      setDeleteError('');
      setDeleteTarget(selectedCategory);
    }
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
    setDeleteError('');
  }

  function confirmDeleteCategory() {
    if (!deleteTarget) {
      return;
    }

    postApi('../api/categories.php', { action: 'delete', category_id: deleteTarget.category_id })
      .then((payload) => {
        if (!payload.ok) {
          setDeleteError(payload.message || 'Kategori gagal dihapus.');
          return;
        }

        closeDeleteModal();
        reloadCategoryTable();
      })
      .catch(() => setDeleteError('Kategori gagal dihapus.'));
  }

  const categoryColumns = useMemo(() => [
    { title: 'Nama Kategori', data: 'category_name' },
    {
      title: 'Outlet',
      data: 'outlet_names',
      render: (data) => data || '<span class="text-muted">Belum dipakai outlet</span>',
    },
    {
      title: 'Aksi',
      data: null,
      orderable: false,
      searchable: false,
      render: (_data, _type, row) => {
        const id = encodeURIComponent(String(row.category_id));

        return `
          <div class="staff-actions outlet-actions">
            <button class="btn btn-sm staff-action edit" type="button" data-action="edit" data-id="${id}">Edit</button>
            <button class="btn btn-sm staff-action delete" type="button" data-action="delete" data-id="${id}">Hapus</button>
          </div>
        `;
      },
    },
  ], []);

  const categoryAjax = useMemo(() => (request, callback) => {
    postApi('../api/categories.php', { ...request, action: 'datatable' })
      .then((payload) => {
        const rows = Array.isArray(payload.data) ? payload.data.map(normalizeCategory) : [];

        setCategories(rows);
        callback({
          draw: Number(payload.draw ?? request.draw ?? 0),
          recordsTotal: Number(payload.recordsTotal ?? 0),
          recordsFiltered: Number(payload.recordsFiltered ?? 0),
          data: rows,
        });
      })
      .catch(() => {
        setCategories([]);
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
                  <p className="eyebrow">Master kategori menu</p>
                  <h2>Daftar Kategori Menu</h2>
                </div>
              </div>

              <div className="table-responsive order-table-wrap" onClick={handleTableAction}>
                <DataTable
                  ref={categoryTableRef}
                  className="table table-hover align-middle navia-data-table"
                  ajax={categoryAjax}
                  columns={categoryColumns}
                  options={categoryTableOptions}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <span className="section-icon">
                  <Tag size={22} />
                </span>
                <div>
                  <p className="eyebrow">Master kategori menu</p>
                  <h2 id="category-modal-title">{modalMode === 'edit' ? 'Edit Kategori' : 'Kategori Baru'}</h2>
                </div>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="master-form modal-form" onSubmit={handleCategorySubmit}>
              {formError ? <div className="alert alert-danger mb-1">{formError}</div> : null}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="category-name">Nama Kategori</label>
                  <input className="form-control" id="category-name" type="text" value={categoryForm.category_name} onChange={(event) => updateCategoryField('category_name', event.target.value)} required />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn primary-button" type="submit">
                  {modalMode === 'edit' ? <Pencil size={18} /> : <Plus size={18} />}
                  {modalMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="delete-category-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Hapus kategori</p>
                <h2 id="delete-category-title">Yakin mau hapus?</h2>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            <div className="confirm-body">
              <p>{deleteTarget.category_name}</p>
              {deleteError ? <div className="alert alert-danger mb-0">{deleteError}</div> : null}
              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={closeDeleteModal}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn danger-button" type="button" onClick={confirmDeleteCategory}>
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
