import { Pencil, X } from 'lucide-react';

export const emptyUserInfoForm = {
  username: '',
  fullname: '',
  email: '',
  phone: '',
  role: '',
};

export const emptyPasswordForm = {
  old_password: '',
  new_password: '',
  confirm_password: '',
};

export function UserInfoModal({
  form,
  error,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="modal-layer" role="presentation">
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="user-info-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Akun</p>
            <h2 id="user-info-title">Info User</h2>
          </div>
          <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="master-form modal-form" onSubmit={onSubmit}>
          {error ? <div className="alert alert-danger mb-1">{error}</div> : null}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="profile-username">Username</label>
              <input className="form-control" id="profile-username" type="text" value={form.username} disabled />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="profile-fullname">Nama Lengkap</label>
              <input className="form-control" id="profile-fullname" type="text" value={form.fullname} onChange={(event) => onChange('fullname', event.target.value)} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="profile-email">Email</label>
              <input className="form-control" id="profile-email" type="email" value={form.email} onChange={(event) => onChange('email', event.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="profile-phone">No. HP</label>
              <input className="form-control" id="profile-phone" type="tel" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="profile-role">Role</label>
              <input className="form-control" id="profile-role" type="text" value={form.role} disabled />
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn ghost-button" type="button" onClick={onClose}>
              <X size={18} />
              Batal
            </button>
            <button className="btn primary-button" type="submit">
              <Pencil size={18} />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ChangePasswordModal({
  form,
  error,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="modal-layer" role="presentation">
      <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="password-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Akun</p>
            <h2 id="password-title">Ganti Password</h2>
          </div>
          <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="master-form modal-form" onSubmit={onSubmit}>
          {error ? <div className="alert alert-danger mb-1">{error}</div> : null}
          <label className="form-label" htmlFor="old-password">Password Lama</label>
          <input className="form-control" id="old-password" type="password" value={form.old_password} onChange={(event) => onChange('old_password', event.target.value)} required />

          <label className="form-label" htmlFor="new-password">Password Baru</label>
          <input className="form-control" id="new-password" type="password" value={form.new_password} onChange={(event) => onChange('new_password', event.target.value)} required />

          <label className="form-label" htmlFor="confirm-password">Konfirmasi Password Baru</label>
          <input className="form-control" id="confirm-password" type="password" value={form.confirm_password} onChange={(event) => onChange('confirm_password', event.target.value)} required />

          <div className="modal-actions">
            <button className="btn ghost-button" type="button" onClick={onClose}>
              <X size={18} />
              Batal
            </button>
            <button className="btn primary-button" type="submit">
              Simpan Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AlertModal({ eyebrow, title = 'Info', message, onClose }) {
  return (
    <div className="modal-layer" role="presentation">
      <div className="modal-panel confirm-panel" role="alertdialog" aria-modal="true" aria-labelledby="alert-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="alert-title">{title}</h2>
          </div>
          <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="confirm-body">
          <p>{message}</p>
          <div className="modal-actions">
            <button className="btn primary-button" type="button" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
