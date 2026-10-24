import { useState } from 'react';
import { LogIn, X } from 'lucide-react';
import { postApi } from '../lib/api';
import { fullNameStorageKey, roleIdStorageKey, userIdStorageKey, writeStorage } from '../lib/storage';

export function LoginView({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);

    postApi('../api/login.php', { username, password })
      .then((payload) => {
        if (!payload.ok || !payload.data?.userid) {
          setAlertMessage(payload.message || `Tidak ada user aktif dengan username : ${username}`);
          return;
        }

        const nextFullname = String(payload.data.fullname || payload.data.username || '');
        const nextRoleId = String(payload.data.role_id || payload.data.role || '');
        writeStorage(userIdStorageKey, String(payload.data.userid));
        writeStorage(fullNameStorageKey, nextFullname);
        writeStorage(roleIdStorageKey, nextRoleId);

        onLogin({
          userid: String(payload.data.userid),
          fullname: nextFullname,
          role_id: nextRoleId,
        });
      })
      .catch(() => setAlertMessage(`Tidak ada user aktif dengan username : ${username}`))
      .finally(() => setIsSubmitting(false));
  }

  return (
    <main className="login-shell">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <span>BBC-Zone</span>
          <strong>Navia Admin</strong>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div>
            <p className="eyebrow">Masuk</p>
            <h1 id="login-title">Masuk Dashboard</h1>
          </div>

          <div>
            <label className="form-label" htmlFor="login-username">Username</label>
            <input className="form-control" id="login-username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </div>

          <div>
            <label className="form-label" htmlFor="login-password">Password</label>
            <input className="form-control" id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </div>

          <button className="btn primary-button w-100" type="submit" disabled={isSubmitting}>
            <LogIn size={18} />
            {isSubmitting ? 'Memeriksa' : 'Masuk'}
          </button>
        </form>
      </section>

      {alertMessage ? (
        <div className="modal-layer" role="presentation">
          <div className="modal-panel confirm-panel" role="alertdialog" aria-modal="true" aria-labelledby="login-alert-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Login gagal</p>
                <h2 id="login-alert-title">Info</h2>
              </div>
              <button className="btn btn-light icon-button modal-close" type="button" aria-label="Tutup" onClick={() => setAlertMessage('')}>
                <X size={20} />
              </button>
            </div>
            <div className="confirm-body">
              <p>{alertMessage}</p>
              <div className="modal-actions">
                <button className="btn primary-button" type="button" onClick={() => setAlertMessage('')}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
