import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

export function TransactionDeleteModal({ roleId, title, targetText, error, onClose, onConfirm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const needsApproval = useMemo(() => {
    const numericRoleId = Number(roleId || 0);
    return numericRoleId <= 0 || numericRoleId > 3;
  }, [roleId]);

  useEffect(() => {
    setUsername('');
    setPassword('');
    setLocalError('');
  }, [targetText, needsApproval]);

  function submitDelete(event) {
    event.preventDefault();

    if (needsApproval && (!username.trim() || !password)) {
      setLocalError('Username dan password manager wajib diisi.');
      return;
    }

    setLocalError('');
    onConfirm({
      approval_username: username.trim(),
      approval_password: password,
    });
  }

  return (
    <div className="modal-layer" role="presentation">
      <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-labelledby="transaction-delete-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{title}</p>
            <h2 id="transaction-delete-title">{needsApproval ? 'Butuh persetujuan manager' : 'Yakin mau hapus?'}</h2>
          </div>
          <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="confirm-body master-form" onSubmit={submitDelete}>
          <p>
            {needsApproval
              ? 'Panggilkan setidaknya Manager Anda untuk menyetujui proses delete pada transaksi ini.'
              : targetText}
          </p>

          {needsApproval ? (
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" htmlFor="approval-username">Username</label>
                <input className="form-control" id="approval-username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" autoFocus />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="approval-password">Password</label>
                <input className="form-control" id="approval-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
              </div>
            </div>
          ) : null}

          {localError || error ? <div className="alert alert-danger mb-0">{localError || error}</div> : null}

          <div className="modal-actions">
            <button className="btn ghost-button" type="button" onClick={onClose}>
              <X size={18} />
              Batal
            </button>
            <button className="btn danger-button" type="submit">
              Hapus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
