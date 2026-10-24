import { useEffect, useMemo, useRef, useState } from 'react';
import { Pencil, Plus, UserRoundPlus, X } from 'lucide-react';
import DataTable from 'datatables.net-react';
import { postApi } from '../lib/api';
import { emptyStaffForm, normalizeStaff, userTableOptions, visibleUsers } from '../features/staff/staffUtils';

export function StaffView({ createSignal }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalMode, setModalMode] = useState('new');
  const [staffForm, setStaffForm] = useState(emptyStaffForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const staffTableRef = useRef(null);
  const lastCreateSignalRef = useRef(createSignal);

  useEffect(() => {
    postApi('../api/users.php', { action: 'roles' })
      .then((payload) => {
        setRoles(Array.isArray(payload.data) ? payload.data : []);
      })
      .catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    if (createSignal !== lastCreateSignalRef.current) {
      lastCreateSignalRef.current = createSignal;
      openCreateModal();
    }
  }, [createSignal]);

  useEffect(() => {
    if (isModalOpen && modalMode === 'new' && !staffForm.role_id && roles.length > 0) {
      updateStaffField('role_id', firstRoleId());
    }
  }, [roles, isModalOpen, modalMode, staffForm.role_id]);

  function firstRoleId() {
    return String(roles[0]?.id ?? '');
  }

  function reloadStaffTable() {
    staffTableRef.current?.dt()?.ajax.reload(null, false);
  }

  function openCreateModal() {
    setModalMode('new');
    setFormError('');
    setStaffForm({ ...emptyStaffForm, role_id: firstRoleId() });
    setIsModalOpen(true);
  }

  function openEditModal(staff) {
    setModalMode('edit');
    setFormError('');
    setStaffForm(normalizeStaff(staff));
    setIsModalOpen(true);
  }

  function updateStaffField(field, value) {
    setStaffForm((current) => ({ ...current, [field]: value }));
  }

  function handleStaffSubmit(event) {
    event.preventDefault();

    const nextStaff = normalizeStaff(staffForm);
    const action = modalMode === 'edit' ? 'update' : 'create';

    if (!nextStaff.role_id || nextStaff.role_id === '1') {
      setFormError('Role wajib dipilih.');
      return;
    }

    if (modalMode === 'new' && !staffForm.password.trim()) {
      setFormError('Password wajib diisi untuk user baru.');
      return;
    }

    postApi('../api/users.php', {
      action,
      id: nextStaff.id,
      username: nextStaff.username,
      fullname: nextStaff.fullname,
      email: nextStaff.email,
      phone: nextStaff.phone,
      role_id: nextStaff.role_id,
      isActive: nextStaff.isActive ? '1' : '0',
      password: staffForm.password,
    })
      .then((payload) => {
        if (!payload.ok) {
          setFormError(payload.message || 'Data gagal disimpan.');
          return;
        }

        setIsModalOpen(false);
        reloadStaffTable();
      })
      .catch(() => setFormError('API gagal dihubungi.'));
  }

  function handleTableAction(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const staffId = decodeURIComponent(button.dataset.id || '');
    const selectedStaff = users.find((staff) => staff.id === staffId);

    if (!selectedStaff) {
      return;
    }

    if (button.dataset.action === 'edit') {
      openEditModal(selectedStaff);
      return;
    }

    if (button.dataset.action === 'delete') {
      setDeleteTarget(selectedStaff);
      return;
    }

    if (button.dataset.action === 'resetPassword') {
      setResetTarget(selectedStaff);
      return;
    }
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
  }

  function confirmDeleteUser() {
    if (!deleteTarget) {
      return;
    }

    postApi('../api/users.php', { action: 'delete', id: deleteTarget.id })
      .then(() => {
        closeDeleteModal();
        reloadStaffTable();
      })
      .catch(() => closeDeleteModal());
  }

  function closeResetModal() {
    setResetTarget(null);
  }

  function confirmResetPassword() {
    if (!resetTarget) {
      return;
    }

    postApi('../api/users.php', { action: 'resetPassword', id: resetTarget.id })
      .then(() => {
        closeResetModal();
        reloadStaffTable();
      })
      .catch(() => closeResetModal());
  }

  const userColumns = useMemo(() => [
    { title: 'Username', data: 'username' },
    { title: 'Nama Lengkap', data: 'fullname' },
    { title: 'Email', data: 'email' },
    { title: 'No. HP', data: 'phone' },
    { title: 'Role', data: 'role' },
    {
      title: 'Status',
      data: 'isActive',
      render: (data) => `<span class="badge status-badge ${data ? '' : 'inactive'}">${data ? 'Aktif' : 'Nonaktif'}</span>`,
    },
    {
      title: 'Aksi',
      data: null,
      orderable: false,
      searchable: false,
      render: (_data, _type, row) => {
        const id = encodeURIComponent(String(row.id));

        return `
          <div class="staff-actions">
            <button class="btn btn-sm staff-action edit" type="button" data-action="edit" data-id="${id}">Edit</button>
            <button class="btn btn-sm staff-action delete" type="button" data-action="delete" data-id="${id}">Hapus</button>
            <button class="btn btn-sm staff-action reset" type="button" data-action="resetPassword" data-id="${id}">Reset Password</button>
          </div>
        `;
      },
    },
  ], []);

  const staffAjax = useMemo(() => (request, callback) => {
    postApi('../api/users.php', { ...request, action: 'datatable' })
      .then((payload) => {
        const rows = Array.isArray(payload.data) ? visibleUsers(payload.data) : [];

        setUsers(rows);
        callback({
          draw: Number(payload.draw ?? request.draw ?? 0),
          recordsTotal: Number(payload.recordsTotal ?? 0),
          recordsFiltered: Number(payload.recordsFiltered ?? 0),
          data: rows,
        });
      })
      .catch(() => {
        setUsers([]);
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
                <p className="eyebrow">Master staff</p>
                <h2>Daftar Staff</h2>
              </div>
            </div>

            <div className="table-responsive order-table-wrap" onClick={handleTableAction}>
              <DataTable
                ref={staffTableRef}
                className="table table-hover align-middle navia-data-table"
                ajax={staffAjax}
                columns={userColumns}
                options={userTableOptions}
              />
            </div>
          </div>
        </article>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="staff-modal-title">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <span className="section-icon">
                  <UserRoundPlus size={22} />
                </span>
                <div>
                  <p className="eyebrow">Master staff</p>
                  <h2 id="staff-modal-title">{modalMode === 'edit' ? 'Edit Staff' : 'User Baru'}</h2>
                </div>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="master-form modal-form" onSubmit={handleStaffSubmit}>
              {formError ? <div className="alert alert-danger mb-1">{formError}</div> : null}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="staff-username">Username</label>
                  <input className="form-control" id="staff-username" type="text" value={staffForm.username} onChange={(event) => updateStaffField('username', event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="staff-fullname">Nama Lengkap</label>
                  <input className="form-control" id="staff-fullname" type="text" value={staffForm.fullname} onChange={(event) => updateStaffField('fullname', event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="staff-email">Email</label>
                  <input className="form-control" id="staff-email" type="email" value={staffForm.email} onChange={(event) => updateStaffField('email', event.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="staff-phone">No. HP</label>
                  <input className="form-control" id="staff-phone" type="tel" value={staffForm.phone} onChange={(event) => updateStaffField('phone', event.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="staff-role">Role</label>
                  <select className="form-select" id="staff-role" value={staffForm.role_id} onChange={(event) => updateStaffField('role_id', event.target.value)} required>
                    <option value="">Pilih role</option>
                    {roles.map((role) => (
                      <option value={role.id} key={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                {modalMode === 'new' ? (
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="staff-password">Password</label>
                    <input className="form-control" id="staff-password" type="password" value={staffForm.password} onChange={(event) => updateStaffField('password', event.target.value)} required />
                  </div>
                ) : null}
                <div className="col-12 col-md-6 d-flex align-items-end">
                  <div className="form-check form-switch">
                    <input className="form-check-input" id="staff-active" type="checkbox" checked={staffForm.isActive} onChange={(event) => updateStaffField('isActive', event.target.checked)} />
                    <label className="form-check-label" htmlFor="staff-active">Aktif</label>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn primary-button" type="submit">
                  {modalMode === 'edit' ? <Pencil size={18} /> : <Plus size={18} />}
                  {modalMode === 'edit' ? 'Simpan Perubahan' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Hapus user</p>
                <h2 id="delete-modal-title">Yakin mau hapus?</h2>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            <div className="confirm-body">
              <p>{deleteTarget.fullname || deleteTarget.username}</p>
              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={closeDeleteModal}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn danger-button" type="button" onClick={confirmDeleteUser}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {resetTarget ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Reset password</p>
                <h2 id="reset-modal-title">Reset Password</h2>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={closeResetModal}>
                <X size={20} />
              </button>
            </div>
            <div className="confirm-body">
              <p>Password untuk username {resetTarget.username} akan otomatis tereset menjadi 1234</p>
              <p>Yakin mau reset password user ini?</p>
              <div className="modal-actions">
                <button className="btn ghost-button" type="button" onClick={closeResetModal}>
                  <X size={18} />
                  Batal
                </button>
                <button className="btn danger-button" type="button" onClick={confirmResetPassword}>
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
