import { useEffect, useMemo, useRef, useState } from 'react';
import { ChefHat, Pencil, Plus, X } from 'lucide-react';
import DataTable from 'datatables.net-react';
import { postApi } from '../lib/api';
import { emptyMenuForm, menuTableOptions, normalizeMenu } from '../features/menu/menuUtils';

export function MenuView({ createSignal }) {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuForm, setMenuForm] = useState(emptyMenuForm);
  const [modalMode, setModalMode] = useState('new');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const menuTableRef = useRef(null);
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
    if (isModalOpen && modalMode === 'new' && !menuForm.category_id && categories.length > 0) {
      updateMenuField('category_id', String(categories[0].id));
    }
  }, [categories, isModalOpen, modalMode, menuForm.category_id]);

  function reloadMenuTable() {
    menuTableRef.current?.dt()?.ajax.reload(null, false);
  }

  function openCreateModal() {
    setModalMode('new');
    setFormError('');
    setMenuForm(emptyMenuForm);
    setIsModalOpen(true);
  }

  function openEditModal(menu) {
    setModalMode('edit');
    setFormError('');
    setMenuForm(normalizeMenu(menu));
    setIsModalOpen(true);
  }

  function updateMenuField(field, value) {
    setMenuForm((current) => ({ ...current, [field]: value }));
  }

  function handleMenuSubmit(event) {
    event.preventDefault();

    const nextMenu = normalizeMenu(menuForm);
    const action = modalMode === 'edit' ? 'update' : 'create';

    if (!nextMenu.menu_name.trim()) {
      setFormError('Nama menu wajib diisi.');
      return;
    }

    if (!nextMenu.category_id) {
      setFormError('Kategori menu wajib dipilih.');
      return;
    }

    postApi('../api/menu.php', {
      action,
      menu_id: nextMenu.menu_id,
      menu_name: nextMenu.menu_name,
      harga: nextMenu.harga,
      category_id: nextMenu.category_id,
      description: nextMenu.description,
    })
      .then((payload) => {
        if (!payload.ok) {
          setFormError(payload.message || 'Data menu gagal disimpan.');
          return;
        }

        setIsModalOpen(false);
        reloadMenuTable();
      })
      .catch(() => setFormError('API gagal dihubungi.'));
  }

  function handleTableAction(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const menuId = decodeURIComponent(button.dataset.id || '');
    const selectedMenu = menus.find((menu) => menu.menu_id === menuId);

    if (!selectedMenu) {
      return;
    }

    if (button.dataset.action === 'edit') {
      openEditModal(selectedMenu);
      return;
    }

    if (button.dataset.action === 'delete') {
      setDeleteTarget(selectedMenu);
    }
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
  }

  function confirmDeleteMenu() {
    if (!deleteTarget) {
      return;
    }

    postApi('../api/menu.php', { action: 'delete', menu_id: deleteTarget.menu_id })
      .then(() => {
        closeDeleteModal();
        reloadMenuTable();
      })
      .catch(() => closeDeleteModal());
  }

  const menuColumns = useMemo(() => [
    { title: 'Nama Menu', data: 'menu_name' },
    { title: 'Kategori', data: 'category_name' },
    {
      title: 'Outlet',
      data: 'outlet_names',
      render: (data) => data || '<span class="text-muted">Belum ada outlet</span>',
    },
    {
      title: 'Harga',
      data: 'harga',
      render: (data) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(Number(data || 0)),
    },
    { title: 'Deskripsi', data: 'description' },
    {
      title: 'Aksi',
      data: null,
      orderable: false,
      searchable: false,
      render: (_data, _type, row) => {
        const id = encodeURIComponent(String(row.menu_id));

        return `
          <div class="staff-actions outlet-actions">
            <button class="btn btn-sm staff-action edit" type="button" data-action="edit" data-id="${id}">Edit</button>
            <button class="btn btn-sm staff-action delete" type="button" data-action="delete" data-id="${id}">Hapus</button>
          </div>
        `;
      },
    },
  ], []);

  const menuAjax = useMemo(() => (request, callback) => {
    postApi('../api/menu.php', { ...request, action: 'datatable' })
      .then((payload) => {
        const rows = Array.isArray(payload.data) ? payload.data.map(normalizeMenu) : [];

        setMenus(rows);
        callback({
          draw: Number(payload.draw ?? request.draw ?? 0),
          recordsTotal: Number(payload.recordsTotal ?? 0),
          recordsFiltered: Number(payload.recordsFiltered ?? 0),
          data: rows,
        });
      })
      .catch(() => {
        setMenus([]);
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
                  <p className="eyebrow">Master menu</p>
                  <h2>Daftar Menu</h2>
                </div>
              </div>

              <div className="table-responsive order-table-wrap" onClick={handleTableAction}>
                <DataTable
                  ref={menuTableRef}
                  className="table table-hover align-middle navia-data-table"
                  ajax={menuAjax}
                  columns={menuColumns}
                  options={menuTableOptions}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="menu-modal-title">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <span className="section-icon">
                  <ChefHat size={22} />
                </span>
                <div>
                  <p className="eyebrow">Master menu</p>
                  <h2 id="menu-modal-title">{modalMode === 'edit' ? 'Edit Menu' : 'Menu Baru'}</h2>
                </div>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="master-form modal-form" onSubmit={handleMenuSubmit}>
              {formError ? <div className="alert alert-danger mb-1">{formError}</div> : null}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="menu-name">Nama Menu</label>
                  <input className="form-control" id="menu-name" type="text" value={menuForm.menu_name} onChange={(event) => updateMenuField('menu_name', event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="menu-category">Kategori</label>
                  <select className="form-select" id="menu-category" value={menuForm.category_id} onChange={(event) => updateMenuField('category_id', event.target.value)} required>
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option value={category.id} key={category.id}>
                        {category.outlets ? `${category.name} - ${category.outlets}` : category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="menu-price">Harga</label>
                  <input className="form-control" id="menu-price" type="number" min="0" step="100" value={menuForm.harga} onChange={(event) => updateMenuField('harga', event.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="menu-description">Deskripsi</label>
                  <textarea className="form-control" id="menu-description" rows="4" value={menuForm.description} onChange={(event) => updateMenuField('description', event.target.value)} />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn primary-button" type="submit">
                  {modalMode === 'edit' ? <Pencil size={18} /> : <Plus size={18} />}
                  {modalMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="delete-menu-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Hapus menu</p>
                <h2 id="delete-menu-title">Yakin mau hapus?</h2>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            <div className="confirm-body">
              <p>{deleteTarget.menu_name}</p>
              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={closeDeleteModal}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn danger-button" type="button" onClick={confirmDeleteMenu}>
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
